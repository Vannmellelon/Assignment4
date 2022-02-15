let turtle = "🐢"; // important

// Bank assignments
const elBtnGetLoan = document.getElementById("BtnGetLoan");
const elBtnRepayLoan = document.getElementById("BtnRepayLoan")
const elDispBalance = document.getElementById("DispBalance");
const elDispLoan = document.getElementById("DispLoan");

elBtnGetLoan.addEventListener("click", funcGetLoan);

const bankMoney = {
    balance:500,
    loan:0,
};
let boolHasLoan = false;


// Work assignments
const elBtnWork = document.getElementById("BtnWork");
const elBtnBank = document.getElementById("BtnBank");
const elDispSalary = document.getElementById("DispSalary");

elBtnWork.addEventListener("click", funcWork);
elBtnBank.addEventListener("click", funcTransfer);
elBtnRepayLoan.addEventListener("click", funcBankRepayLoan);

const workMoney = {
    salary:0,
}


// Laptop assignments
const elLaptopSelector = document.getElementById("LaptopSelector");
const elDispLaptopFeatures = document.getElementById("DispLaptopFeatures");

// Laptop info-box
const elLaptopInfo = document.getElementById("LaptopInfo");
const elImgLaptop = document.getElementById("LaptopImg");
const elNameLaptop = document.getElementById("LaptopName");
const elDescLaptop = document.getElementById("LaptopDesc");
const elPriceLaptop = document.getElementById("LaptopPrice");
const elBtnBuyLaptop = document.getElementById("BtnBuyLaptop");

elLaptopSelector.addEventListener("change", funcDisplayLaptop);
elBtnBuyLaptop.addEventListener("click", funcBuyLaptop);

let globLaptops = [];

// first render
funcRenderBankWork();


// Bank
// Get loan button
// Checks weather or not you already have a loan
// Grants you a loan of the requested amount if lower than or equal to balance*2
function funcGetLoan() {

    if (boolHasLoan) {window.alert("Repay your outstanding loan in full before requesting a new one. 😳");}
    else {
        inpReqLoan = window.prompt("Please input requested loan in NOK: 💸");
        if (inpReqLoan <= bankMoney.balance*2)
        {
            bankMoney.loan = inpReqLoan;
            boolHasLoan = true;
        }
        else {
            window.alert("The loan you have requested is too large. " + 
            "You can only take out a loan that is less than double of your bank balance. 💰💰");
        }
    }
    funcRenderBankWork();
}

// Work
// Repay loan button
// Repays loan from salary
function funcBankRepayLoan() {

    if (workMoney.salary === 0) {
        window.alert("You don't have any money. 😨\nGo do some work! 👨‍💻");
    }
    else {
        bankMoney.balance += funcRepayLoan(workMoney.salary);
        workMoney.salary = 0;
    }
    funcRenderBankWork();
}

// Bank, Work
// Pays off the loan with the provided repay amount
// Returns any superfluous money
function funcRepayLoan(repayAmount) {

    const rest = repayAmount - bankMoney.loan;
    if (repayAmount >= bankMoney.loan) {
        bankMoney.loan = 0;
        boolHasLoan = false;
        window.alert("Congratulations on repaying your loan! 🥳");
    }
    else {
        window.alert("You've repaid part of your loan. 🙌");
        bankMoney.loan -= repayAmount;
    }

    funcRenderBankWork();
    if (rest > 0) return rest;
    else return 0;
}

// Bank, Work
// Renders Loan and Balance, with NOK-formatting, in the Bank-div
// Renders Salary with NOK formatting in the work-div
// Unhides/hides repay loan button
function funcRenderBankWork() {
    if (boolHasLoan) {
        elDispLoan.innerHTML = "Loan: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(bankMoney.loan);
        elBtnRepayLoan.style.display = "block";
    }
    else {
        elDispLoan.innerHTML = "";
        elBtnRepayLoan.style.display = "none";
    }
    elDispBalance.innerHTML = "Balance: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(bankMoney.balance);
    elDispSalary.innerHTML = "Salary: " + new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' }).format(workMoney.salary);

}

// Work
// Adds 100 NOK to salary
// Working hard or hardly working?
function funcWork() {
    workMoney.salary += 100;
    funcRenderBankWork();
}

// Work
// Transfers salary to bank
// 10% of salary goes towards repaying any outstanding loan
function funcTransfer() {
    if (workMoney.salary === 0) {
        window.alert("You don't have any salary to transfer to your bank. 😳\nGo do some work! 👨‍💻");
        return;
    }

    if (boolHasLoan) {
        // 10% goes towards loan
        bankMoney.balance += funcRepayLoan(workMoney.salary*0.1);
        bankMoney.balance += workMoney.salary*0.9;
        workMoney.salary = 0;
    } else {
        bankMoney.balance += workMoney.salary;
        workMoney.salary = 0;
    }
    funcRenderBankWork();
}

// Laptop
// UI controller
const UIController = (() => {

    const _laptopSelector = document.getElementById("LaptopSelector");
    const _imageContainer = document.getElementById("Image");
    const imgURL = "https://noroff-komputer-store-api.herokuapp.com/";

    const _getDOMElements = () => {
        return {
            elLaptopSelector: _laptopSelector
        }
    }

    const _createLaptopSelector = (laptops) => {
        //_laptopSelector.innerHTML = "";
        for (const lp of laptops) {
            _laptopSelector.innerHTML += `<option value="${lp.id}">${lp.title}</option>`;
        }
    }

    // load all images and make them visible as needed by toggling display

    const _getLaptopImages = (laptops) => {
        for (const lp of laptops) {
            _imageContainer.innerHTML += `<img id="img${lp.id}" width="300" src="${imgURL+lp.image}" alt="${lp.title}" style="display:none" >`;
        }
    }

    return {
        getDOMElements: _getDOMElements,
        createLaptopSelector: _createLaptopSelector,
        getLaptopImages: _getLaptopImages
    }
})();

// Laptop
// fetches the info on laptops from the API
const APIController = (() => {

    const URL = "https://noroff-komputer-store-api.herokuapp.com/computers";

    const _laptops = async () => {

        try {
            const response = await fetch(URL);
            const laptopsInfo = await response.json();
            return [ null, laptopsInfo ];
        }
        catch(error) {
            return [ error.message, [] ];
        }
    }
    return {
        fetchLaptops: _laptops
    } 
})();


const AppController = (async (uiCtrl, apiCtrl) => {

    const [error, laptops] = await apiCtrl.fetchLaptops();
    if (error !== null) {
        // Display the error
        return;
    }
    
    uiCtrl.createLaptopSelector(laptops);
    uiCtrl.getLaptopImages(laptops);
    globLaptops = laptops;

})(UIController, APIController);



// Laptop
// Onchange func for select
// messy, make nicer if time, no for-loop 
// Displays specs of the selected laptop in the selectLaptop-div
// Make laptopdiv visible, image, name and description in the laptopInfo-div
// messy, make nicer if time, no for-loop 
function funcDisplayLaptop() {

    elDispLaptopFeatures.innerHTML = "";
    const val = elLaptopSelector.value;

    for (const lp of globLaptops) {
        if (lp.id == val) {
            for (const s of lp.specs) {
                elDispLaptopFeatures.innerHTML += `<li>${s}</li>`;
            }
            break;
        }
    }
    funcRenderLaptopInfo(val);
}


// Laptop
// Display image, name, description and price of laptop
// messy, make nicer if time, no for-loop 
function funcRenderLaptopInfo(laptopId) {

    funcClearLaptopInfo(laptopId);

    for (const lp of globLaptops) {
        if (lp.id == laptopId) {
            document.getElementById("img"+lp.id).style.display = "block";
            elNameLaptop.innerHTML = lp.title;
            elDescLaptop.innerHTML = lp.description;
            elPriceLaptop.innerHTML = lp.price;
            elBtnBuyLaptop.style.display = "block";
        }
    }
}


// Laptop
// Clear laptop-info
function funcClearLaptopInfo(id) {

    // does not work :( whyyy
    document.getElementById("img"+id).style.display = "none";
    elNameLaptop.innerHTML = "";
    elDescLaptop.innerHTML = "";
    elPriceLaptop.innerHTML = ""
    //elBtnBuyLaptop.style.display = "none";

}


// Laptop
// BUY NOW button 
// should buy laptop if you have enough money, alert if you dont, nice mssg if u do :3
function funcBuyLaptop() {
    const price = elPriceLaptop.textContent;
    console.log(price);
    if (bankMoney.balance >= price) {
        window.alert(`Congratulations on your newly purchased ${elNameLaptop.textContent} komputer!\n\nEnjoy!🥳👩‍💻`);
        bankMoney.balance -= price;
        funcRenderBankWork();
    } else {window.alert(`You can't afford this komputer!\n\nGo work!👩‍💻💦`);
}
}
