
const rootUrl = 'https://expense-app-9b511-default-rtdb.asia-southeast1.firebasedatabase.app/';
const signupForm = document.querySelector('#signup-section__form');

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
        let initalResult;
        try {
            initalResult = await fetch(`${rootUrl}users.json`,
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

            if(!initalResult.ok) {
                new Error('Something wrong during signup. Try again');
                return;
            }

            this.outputData = initalResult.ok;
        }catch(error){
            return error.message
        }
    }

    _successfulSignedUp(){
        if(this.signedupData) {
            return 'Account successfully created!'
        }

        return 'Something went wrong with the process. Please try again';
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
    console.log(newUser._successfulSignedUp());
})