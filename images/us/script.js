import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


const appSettings = {
    databaseURL: "https://playground-888e0-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const rebMikeListDB = ref(database, "RebMike");

let lastTap = 0;

// DOM Elements
let itemList = document.getElementById("items-list");
const cartButton = document.getElementById("insert-btn");
const inputBar = document.getElementById("input-box");


// ======================================================
// FLOATING HEART ANIMATION
// ======================================================

function createFloatingHearts(note) {

    for (let i = 0; i < 50; i++) {

        const heart = document.createElement("span");

        heart.classList.add("floating-heart");
        heart.textContent = "❤️";

        // Random starting position
        heart.style.left = `${20 + Math.random() * 60}%`;

        // Random horizontal movement
        const randomX = (Math.random() * 100 - 50) + "px";
        heart.style.setProperty("--heart-x", randomX);

        // Random rotation
        const rotation = (Math.random() * 60 - 30) + "deg";
        heart.style.setProperty("--heart-rotation", rotation);

        // Random size
        heart.style.fontSize = `${14 + Math.random() * 10}px`;

        // Stagger the hearts
        heart.style.animationDelay = `${i * 150}ms`;

        // Add heart to the note
        note.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 3000);
    }
}


// ======================================================
// KEEP TRACK OF EXISTING NOTES
// ======================================================

// This prevents hearts from appearing when the page
// initially loads all the existing Firebase notes.

let knownItems = new Set();
let firstLoad = true;


// ======================================================
// FIREBASE DATABASE
// ======================================================

onValue(rebMikeListDB, function(snapshot) {

    itemList.innerHTML = "";

    if (snapshot.exists()) {

        let dbItemsArray = Object.entries(snapshot.val());

        for (let i = 0; i < dbItemsArray.length; i++) {

            let dbItemKey = dbItemsArray[i][0];
            let dbItemValue = dbItemsArray[i][1];

            let newListItem = document.createElement("li");


            // ==================================================
            // CHECK WHICH PERSON CREATED THE NOTE
            // ==================================================

            if (dbItemValue.substr(-4) === "ukuk") {

                newListItem.textContent = `${dbItemValue.slice(0, -4)}`;

                newListItem.id = "mike";

            } else {

                newListItem.textContent = dbItemValue;

            }


            // Add the note to the page
            itemList.append(newListItem);


            // ==================================================
            // CREATE FLOATING HEARTS FOR NEW NOTES ❤️
            // ==================================================

            if (!firstLoad && !knownItems.has(dbItemKey)) {

                createFloatingHearts(newListItem);

            }

            // Remember this note
            knownItems.add(dbItemKey);


            // ==================================================
            // DOUBLE TAP TO DELETE
            // ==================================================

            newListItem.addEventListener("click", function(e) {

                const now = new Date().getTime();
                const timespan = now - lastTap;


                if (timespan < 300 && timespan > 0) {

                    let exactLocationOfItemInDB = ref(
                        database,
                        `RebMike/${dbItemKey}`
                    );

                    remove(exactLocationOfItemInDB);


                    // Prevents iOS Safari from zooming
                    // in on the double-tap
                    e.preventDefault();

                }


                lastTap = now;

            });

        }

    } else {

        itemList.textContent = "no items in the list yet";

    }


    // Initial Firebase load is now complete
    firstLoad = false;

});


// ======================================================
// ADD NOTE BUTTON
// ======================================================

let michaelColor = document.getElementById("Michael");


cartButton.addEventListener("click", function() {

    event.preventDefault();


    // Don't add an empty note
    if (inputBar.value.trim() === "") {
        return;
    }


    // ==================================================
    // MICHAEL / REBECCA NOTE COLOUR
    // ==================================================

    if (getComputedStyle(michaelColor).color === "rgb(251, 144, 0)") {

        let currentInput = `${inputBar.value}ukuk`;

        push(rebMikeListDB, currentInput);

        inputBar.value = "";

    } else {

        let currentInput = `${inputBar.value}`;

        push(rebMikeListDB, currentInput);

        inputBar.value = "";

    }

});


// ======================================================
// CHANGE MICHAEL'S COLOUR
// ======================================================

michaelColor.addEventListener("dblclick", function() {

    michaelColor.style.color = "#FB9000";

});


// ======================================================
// RANDOM IMAGE PROJECT
// ======================================================

let imageRender = document.getElementById("image-to-display");

let randomNumber = Math.floor(Math.random() * 49 + 1);


setTimeout(() => {

    const image = imageRender.querySelector(".image");

    image.id = "border"


    // Fade out
    image.style.opacity = "0";


    // Wait for fade-out to finish
    setTimeout(() => {

        image.src = `images/us/${randomNumber}.jpg`;
        


        // Fade back in
        image.style.opacity = "1";

    }, 400);

}, 3000);