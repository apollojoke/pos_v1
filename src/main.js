parseShoppingList = function (inputs) {
    var shoppingList = {};
    for(var i=0; i<=inputs.length-1; i++) {
        var barCode = inputs[i];
        var itemNum = 1;
        if (inputs[i].indexOf('-')>0){
            barCode = inputs[i].split('-')[0];
            itemNum = parseInt(inputs[i].split('-')[1]);
        }

        if (shoppingList.hasOwnProperty(barCode)) {
            shoppingList[barCode] += itemNum;
        }
        else {
            shoppingList[barCode] = itemNum;
        }
    }
    return shoppingList
};

function generatePromotionsList (shoppingList) {
    var promotions = loadPromotions();
    var promotionList = {};
    for(var i=0; i<= promotions.length-1; i++){
        if(promotions[i].hasOwnProperty('type')){
            switch (promotions[i].type){
                case 'BUY_TWO_GET_ONE_FREE':
                    var barCodes = promotions[i].barcodes;
                    for (var j=0; j<= barCodes.length-1; j++ ){
                        if(shoppingList.hasOwnProperty(barCodes[j])){
                            promotionList[barCodes[j]] = parseInt(shoppingList[barCodes[j]]/3);
                        }
                    }
                    break;
                //add other cases here
                default :
                    break;
            }
        }
    }
    return promotionList;
}

function populateList(list) {
    var items = {};
    var allItems = loadAllItems();
    for(var barCode in list ){
        for(var i=0; i<= allItems.length-1; i++){
            if(allItems[i].barcode === barCode){
                items[barCode] = {
                    name : allItems[i].name,
                    unit: allItems[i].unit,
                    price: allItems[i].price,
                    number : list[barCode]
                }
            }
        }
    }
    return items;
}

function Inventory(shoppingList){
    this.shoppingList = populateList(shoppingList);
    this.promotionList = populateList(generatePromotionsList(shoppingList));
    this.totalPrice = 0;
    this.totalSaved = 0;
    this.printShoppingList = function(){
        var message = '';
        for(var barCode in this.shoppingList){
            var payNumber;
            if(this.promotionList.hasOwnProperty(barCode)){
                payNumber = this.shoppingList[barCode].number - this.promotionList[barCode].number;
                this.shoppingList[barCode].saved = (this.promotionList[barCode].number * this.shoppingList[barCode].price);
            }
            else{
                payNumber = this.shoppingList[barCode].number;
                this.shoppingList[barCode].saved = 0;
            }
            this.shoppingList[barCode].sum = (this.shoppingList[barCode].price * payNumber);
            this.totalPrice += this.shoppingList[barCode].sum;
            this.totalSaved += this.shoppingList[barCode].saved;
            message +=
                '名称：' + this.shoppingList[barCode].name +'，'+
                '数量：' + this.shoppingList[barCode].number + this.shoppingList[barCode].unit + '，' +
                '单价：' + this.shoppingList[barCode].price.toFixed(2) + '(元)，' +
                '小计：' + this.shoppingList[barCode].sum.toFixed(2) + '(元)\n';
        }
        return message;
    };
    this.printPromotionList = function(){
        var message='';
        for(var barCode in this.promotionList){
            message +=
                '名称：' + this.promotionList[barCode].name + '，'+
                '数量：' + this.promotionList[barCode].number +  this.promotionList[barCode].unit + '\n';
        }
        return message;
    };
    this.printTotalPrice = function(){
        return '总计：'+ this.totalPrice.toFixed(2) + '(元)\n';
    };
    this.printTotalSaved = function(){
        return '节省：' + this.totalSaved.toFixed(2) + '(元)\n';
    };
}



var printInventory = function(inputs){
    var shoppingList = parseShoppingList(inputs);
    var inventory = new Inventory(shoppingList);
    console.log(
        '***<没钱赚商店>购物清单***\n' +
        inventory.printShoppingList() +
        '----------------------\n' +
        '挥泪赠送商品：\n' +
        inventory.printPromotionList() +
        '----------------------\n' +
        inventory.printTotalPrice() +
        inventory.printTotalSaved() +
        '**********************'
    );
};