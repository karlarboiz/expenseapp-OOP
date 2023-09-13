const signupForm = document.querySelector('#signup-section__form');
const usersUrl = 'https://new-expense-app-default-rtdb.asia-southeast1.firebasedatabase.app/';
const newNotification = document.querySelector('#notification');
const signupFormInputs = document.querySelectorAll("#signup-section__form input");

class User {
    constructor(name,username,password) {
        this.name = name;
        this.username = username;
        this.password = password;
    }

    _validateSignupInfo() {
        if(this.name === ''||
        this.username === '' ||
        this.password === '') {
            new Error('Invalid Inputs')
            return;
        }

        this._insertUserInputs();
    }

    async _insertUserInputs() {
        let initialResult;
        try {
            initialResult = await fetch(`${usersUrl}users.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.name,
                    username:this.username,
                    password: this.password,
                    signedupDate: new Date()
                }   )
            })
            if(!initialResult.ok) {
                throw new Error('Something wrong during signup. Try again');
            }
        
            this.outputData = initialResult.ok ? 'success' : 'error';
            this._successfulSignedUp('Account successfully created!');
            signupFormInputs.forEach(val=>val.value ='');
        }catch(error){
            this._successfulSignedUp(error.message);
            return;
        }
    }

    _successfulSignedUp(message){
        const messageDiv = document.createElement('div');

        messageDiv.classList.add('message-container',`message-indicator__${this.signedupData}`)
        messageDiv.textContent = message;
        
        newNotification.append(messageDiv);  
        setTimeout(()=>{messageDiv.remove()},3000)
    
    }

    set outputData(val){
        this.signedupData = val;
    }

    get outputData(){
        return this.signedupData;
    }
}

signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const dataForm = new FormData(signupForm);  
    const newUser = new User(dataForm.get('complete-name'),
    dataForm.get('username'),dataForm.get('password'));
    newUser._validateSignupInfo();
    

})