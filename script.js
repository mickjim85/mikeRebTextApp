import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://playground-888e0-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const rebMikeListDB = ref(database, "RebMike");


// DOM Elements
let itemList = document.getElementById("items-list");
const cartButton = document.getElementById("insert-btn");
const inputBar = document.getElementById("input-box");

onValue(rebMikeListDB, function(snapshot) {

    itemList.innerHTML = "";
    // If/Else statement to see if any entries are in the DB.
    if (snapshot.exists()) {


        // three Variables to store DB information
        let dbItemsArray = Object.entries(snapshot.val());
        let dbItemKeysArray = Object.keys(snapshot.val());
        let DatabaseListValue = Object.values(snapshot.val());
        
        // Listen for deletions.
        for (let i = 0; i < dbItemsArray.length; i++) {

            let newListItem = document.createElement("li");
            newListItem.textContent = DatabaseListValue[i];
            itemList.append(newListItem);

            newListItem.addEventListener("dblclick", function() {
                let exactLocationOfItemInDB = ref(database, `RebMike/${dbItemKeysArray[i]}`)
                remove(exactLocationOfItemInDB)

            })
        }

    } else {
        itemList.textContent = "no items in the list yet";
    }

});

cartButton.addEventListener("click", function() {
    let currentInput = inputBar.value
    push(rebMikeListDB, currentInput)
    inputBar.value = "";
})


// image project

let imageRender = document.getElementById("image-to-display");

let randomNumber = Math.floor(Math.random() * 11 + 1);

imageRender.innerHTML = `
                <img class="image" src="images/us/${randomNumber}.jpg" 
                alt="picture of Michael and Rebecca"/>
                `