const entranceSection = document.querySelector('#entrance-section');
const main = document.querySelector('main');
const signupBtnToggle = document.querySelector('.signup-btn__toggle');
const signinBtnToggle = document.querySelector('.signin-btn__toggle');
const signinSectionForm = document.querySelector('#signin-section__form');
const signupSectionForm = document.querySelector('#signup-section__form');
const mainUrl = 'https://new-expense-app-default-rtdb.asia-southeast1.firebasedatabase.app/';
const notification = document.querySelector('#notification');
class App {

    _toggleSignInSignUpPage(){
        signinSectionForm.classList.toggle('hide-form');
        signupSectionForm.classList.toggle('hide-form');
    }

    async _usersData(){
        let initalResult;
        let finalResult;
        let newArrFinalResult = [];
        try {
            initalResult = await fetch(`${mainUrl}users.json`);
            
            if(!initalResult.ok){
                new Error('Something went wrong')
                return;
            }

            finalResult = await initalResult.json();

            for (const key in finalResult) {
                newArrFinalResult.push(finalResult[key])
            }

            return newArrFinalResult;
        }catch(error) {
            return error.message;
        }
    }

    async _siginValidation(username,password){

        const usersArr= await this._usersData();

        try{
            const foundAcc = usersArr.find(val=> {
                if(val.username === username &&
                    val.password === password) {
                        return val;
                    }
            })

            if(!foundAcc) {
                this._showMessage('Credentials not found',true)

                return;
            }

            this._showMessage('Welcome back!',false)

            entranceSection.classList.toggle('hide-form');
            main.classList.toggle('hide-form');
            
        }catch(error){
            this._showMessage(error.message,true);
        }
       
    }

    _showMessage(message,isError){
        const messageDiv = document.createElement('div');

        messageDiv.classList.add('message-container',`message-indicator__${isError ? 'error' : 'success'}`)
        messageDiv.textContent = message;
        
        notification.append(messageDiv);
        
        setTimeout(()=>{messageDiv.remove()},3000)
    }
}


const app = new App();
const users = app._usersData();

signinBtnToggle.addEventListener('click',app._toggleSignInSignUpPage);
signupBtnToggle.addEventListener('click',app._toggleSignInSignUpPage);
signinSectionForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const dataForm = new FormData(signinSectionForm);
    app._siginValidation(dataForm.get('username'),
    dataForm.get('password'));

})





