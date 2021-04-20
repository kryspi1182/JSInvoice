class Product{
    
    constructor(id, name, quantity, price){
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
    }
    
    sum(){
        return this.quantity * this.price;
    }
}

function clearStorage(){
        localStorage.clear();
    }

function onLoadScript(){
       
    var products = [];
    
    const form = document.getElementById("form");
    const name = document.getElementById("name");
    const quantity = document.getElementById("quantity");
    const price = document.getElementById("price");
    const content = document.getElementById("invoice-content");
    const invoiceSum = document.getElementById("invoice-sum");
    if(localStorage.getItem("products") != null){
        loadProductsFromStorage();
    }
    
    function countTotalSum(){
        
        var result = 0;
        if(products.length > 0){
            for (var a = 0; a < products.length; a++){
                result += products[a].sum();
            }
        }
        console.log(result);
        return result;
    }
    
    function buildDocument(){
        content.innerHTML = "";
        for (var x = 0; x < products.length; x++)
            createInvoiceDiv(products[x]);
        localStorage.setItem("products", JSON.stringify(products));
        invoiceSum.innerHTML = countTotalSum().toFixed(2);
    }
    
    function loadProductsFromStorage(){
        var local = JSON.parse(localStorage.getItem("products"));
        for (var y = 0; y < local.length; y++ ){
            products.push(new Product(local[y].id,
                                     local[y].name,
                                     local[y].quantity,
                                     local[y].price));
        }
        console.log("odczyt");
        buildDocument();
    }
    
    function moveProductDown(productId){
        var tmpDown = new Product(++products[productId-1].id,
                             products[productId-1].name,
                             products[productId-1].quantity,
                             products[productId-1].price);
        if(productId < products.length){
            products[productId-1] = new Product(--products[productId].id,
                                                products[productId].name,
                                                products[productId].quantity,
                                                products[productId].price);
            products[productId] = tmpDown;
            buildDocument();
        }
        //console.log("up: "+productId);
        //console.log(tmpDown);
    }
    
    function moveProductUp(productId){
        var tmpUp = new Product(--products[productId-1].id,
                             products[productId-1].name,
                             products[productId-1].quantity,
                             products[productId-1].price);
        if(productId > 1){
            products[productId-1] = new Product(++products[productId-2].id,
                                                products[productId-2].name,
                                                products[productId-2].quantity,
                                                products[productId-2].price);
            products[productId-2] = tmpUp;
            buildDocument();
        }
        
        //console.log("down: "+productId);
    }
    
    function toggleFormVisibility(){
        console.log(this.parentElement.parentElement.nextElementSibling);
        this.parentElement.parentElement.nextElementSibling.setAttribute("style", "display: block;");
    }
    
    function createEditForm(formProduct){
        
        var tempForm = document.createElement("div");
        tempForm.className = "invoice-edit";
        tempForm.setAttribute("style", "display: none;");
        tempForm.setAttribute("id", "edit"+formProduct.id);
        
        var formId = document.createElement("input");
        formId.setAttribute("type", "hidden");
        formId.setAttribute("id", "editId");
        formId.setAttribute("value", formProduct.id);
        tempForm.appendChild(formId);
        
        var formName = document.createElement("input");
        formName.setAttribute("id", "editName");
        formName.setAttribute("value", formProduct.name);
        tempForm.appendChild(formName);
        
        var formQuantity = document.createElement("input");
        formQuantity.setAttribute("type", "number");
        formQuantity.setAttribute("step", "0.01");
        formQuantity.setAttribute("id", "editQuantity");
        formQuantity.setAttribute("value", formProduct.quantity);
        tempForm.appendChild(formQuantity);
        
        var formPrice = document.createElement("input");
        formPrice.setAttribute("type", "number");
        formPrice.setAttribute("step", "0.01");
        formPrice.setAttribute("id", "editPrice");
        formPrice.setAttribute("value", formProduct.price);
        tempForm.appendChild(formPrice);
        
        var formSubmit = document.createElement("button");
        formSubmit.onclick = function() { editProduct(formProduct.id,
                                                     formName.value,
                                                     formQuantity.value,
                                                     formPrice.value); };
        formSubmit.innerHTML = "Edytuj";
        tempForm.appendChild(formSubmit);
        
        return tempForm;
    }
    
    function createInvoiceDiv(tempProduct){
        
        var tempContainer = document.createElement("div");
        tempContainer.className = "invoice-content-div";

        var tempRow = document.createElement("div");
        tempRow.className = "invoice-row";

        var cellLp = document.createElement("div");
        cellLp.className = "invoice-cell";
        cellLp.innerHTML = tempProduct.id;

        var cellName = document.createElement("div");
        cellName.className = "invoice-cell";
        cellName.innerHTML = tempProduct.name;

        var cellQuantity = document.createElement("div");
        cellQuantity.className = "invoice-cell";
        cellQuantity.innerHTML = tempProduct.quantity;

        var cellPrice = document.createElement("div");
        cellPrice.className = "invoice-cell";
        cellPrice.innerHTML = tempProduct.price;

        var cellSum = document.createElement("div");
        cellSum.className = "invoice-cell";
        cellSum.innerHTML = tempProduct.sum().toFixed(2);
        
        var cellOptions = document.createElement("div");
        cellOptions.className = "invoice-cell";
        
        var cellDelete = document.createElement("p");
        cellDelete.innerHTML = "Usuń";
        cellDelete.addEventListener("click", function() {deleteProduct(tempProduct.id);});
        
        var cellEdit = document.createElement("p");
        cellEdit.innerHTML = "Edytuj";
        cellEdit.addEventListener("click", toggleFormVisibility);
        
        var cellMoveUp = document.createElement("p");
        cellMoveUp.innerHTML = "Przesuń w górę";
        cellMoveUp.addEventListener("click", function() { moveProductUp(tempProduct.id); });
        
        var cellMoveDown = document.createElement("p");
        cellMoveDown.innerHTML = "Przesuń w dół";
        cellMoveDown.addEventListener("click", function() { moveProductDown(tempProduct.id); });
        
        cellOptions.appendChild(cellDelete);
        cellOptions.appendChild(cellEdit);
        cellOptions.appendChild(cellMoveUp);
        cellOptions.appendChild(cellMoveDown);

        tempRow.appendChild(cellLp);
        tempRow.appendChild(cellName);
        tempRow.appendChild(cellQuantity);
        tempRow.appendChild(cellPrice);
        tempRow.appendChild(cellSum);
        tempRow.appendChild(cellOptions);

        tempContainer.appendChild(tempRow);
        tempContainer.appendChild(createEditForm(tempProduct));
        content.appendChild(tempContainer);
        //rows.push(tempContainer);
    }

    function deleteProduct(productId){

        //console.log(productId);
        if (productId > 0){
            products.splice(productId-1, 1);
            for (var i = productId-1; i < products.length; i++)
                products[i].id--;
        }
        buildDocument();
        
    }
    
    function editProduct(newId, newName, newQuantity, newPrice){
        
        console.log(newId);
        console.log(newName);
        console.log(newQuantity);
        console.log(newPrice);
        
        products[newId-1].name = newName;
        products[newId-1].quantity = newQuantity;
        products[newId-1].price = newPrice;
        buildDocument();
    }
    
    

    function createProduct(){
        
        var tempId = products.length + 1;
        var tempProduct = new Product(tempId, name.value, parseFloat(quantity.value), parseFloat(price.value));
        products.push(tempProduct);
        buildDocument();
        
        
        //console.log(rows);
        //console.log(products);
    }


    form.addEventListener("submit", createProduct);


}























