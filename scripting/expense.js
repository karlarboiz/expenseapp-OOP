const expenseLogs = document.querySelector('#expense-logs');
const expenseForm = document.querySelector('#expense-form');
const newRootUrl = 'https://new-expense-app-default-rtdb.asia-southeast1.firebasedatabase.app/';
const expenseFormInputs = document.querySelectorAll('#expense-form input');
const anotherNotification = document.querySelector('#notification');
class Expense {
    constructor(title,amount){
        this.title = title;
        this.amount = amount;
    }

    async _insertUserExpenses() {
        let initalResult;
        let finalResult;
        if(this.title === "" ||
        this.amount === "") 
        {new Error('Invalid Inputs')
        return;}
        
        this.itemId= this._id+=1;
        
        try {
            initalResult = await fetch(`${newRootUrl}expenses.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.id,
                    title: this.title,
                    amount:this.amount,
                    expenseDate: new Date()
                }   )
            })

            if(!initalResult.ok) {
                new Error('Something wrong during signup. Try again');
                return;
            }
            this._showMessage('Expense added',false);
            finalResult = await initalResult.json();

            
        }catch(error){
            this._showMessage(error.message,false);
            return;
        }

        return finalResult;
    }

    async _fetchedExpenseLogs(){
        let initalResult;
        let finalResult;
        let usersArr = [];
        try {
            initalResult = await fetch(`${newRootUrl}expenses.json`);
            
            if(!initalResult.ok){
                new Error('Something went wrong')
                return;
            }
    
            finalResult = await initalResult.json();
    
            for (const key in finalResult) {
                const keyName = key;

                let templateData = {
                    [keyName]: finalResult[key]
                }
                
                usersArr.push(templateData)
            }
            this.incrementedId = usersArr.length;
            
        }catch(error) {
            return error.message;
        }
        return usersArr;
    }

    _showMessage(message,isError){
        const messageDiv = document.createElement('div');

        messageDiv.classList.add('message-container',`message-indicator__${isError ? 'error' : 'success'}`)
        messageDiv.textContent = message;
        
        anotherNotification.append(messageDiv);
        
        setTimeout(()=>{messageDiv.remove()},3000)
    }

    get incrementedId(){
        return this._id;
    }

    set incrementedId(val) {
        this._id = val;
    }

    get itemId() {
        return this.id;
    }

    set itemId(val){
        this.id = val;
    }

}   


Expense.prototype.createElements = async function(data,targetEl){
    const allExpenseLogs = await this._fetchedExpenseLogs();
    const foundUploadedExpense = allExpenseLogs.find(val=>{
        for (const key in val) {
            if(key === data.name) return val;
        }
    })

    let newItem;
    for (const key in foundUploadedExpense) {
       newItem = foundUploadedExpense[key]
    }

    this.createElementsHandler(newItem,targetEl);
}

Expense.prototype.createElementsHandler = (item,targetEl) =>{
    const {id,title,amount,expenseDate} = item;
    const expenseItem = document.createElement('div');
    expenseItem.setAttribute('class','expense-item');
    expenseItem.setAttribute('data-id',id);

    const button = document.createElement('button');
    button.setAttribute('class','fa fa-minus-square fa-2x')
    button.setAttribute('data-id',id);

    const expenseTitleEl = document.createElement('h4');
    expenseTitleEl.setAttribute('class','expense-title')
    expenseTitleEl.textContent = title;

    const expenseAmountEl = document.createElement('p');
    expenseAmountEl.setAttribute('class','expense-amount');
    expenseAmountEl.textContent = `Php ${amount}`;

    const expenseDateEl = document.createElement('p');
    expenseDateEl.setAttribute('class','expense-date')
    expenseDateEl.textContent = new Date(expenseDate).toLocaleDateString();

    expenseItem.append(button,expenseTitleEl,expenseAmountEl,expenseDateEl);
    targetEl.append(expenseItem);

    expenseFormInputs.forEach(val=>val.value ='');
}

Expense.prototype.displayAllSavedExpenseLogs = async function(targetEl){
    const allData = await this._fetchedExpenseLogs();
    
    allData.forEach(val=>{
        let newItem;
        for (const key in val) {
        newItem = val[key]
        }

        this.createElementsHandler(newItem,targetEl)
    })

}
const expenseInitiation = new Expense(null,null);

expenseInitiation.displayAllSavedExpenseLogs(expenseLogs);


expenseForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const dataForm = new FormData(expenseForm);

    const newExpense = new Expense(dataForm.get('expense-title'),
    +dataForm.get('expense-amount'));
    await newExpense._fetchedExpenseLogs();
    const outputResult = await newExpense._insertUserExpenses();

    newExpense.createElements(outputResult,expenseLogs);
})

const expenseItems = document.querySelectorAll('.expense-item');

expenseLogs.addEventListener('click',(e)=>{
    const targetEl = e.target.closest('.expense-item');
    if(!targetEl) return;

    console.log(targetEl.dataset.id);
})



