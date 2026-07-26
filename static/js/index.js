

function scrollEl(el, pos) {
    // scrollEl(el, pos)
    // :param el: HTML element
    // :param pos: str ("start" "end")
    el.scrollIntoView({
        behavior: "smooth",
        block: pos
    })
}

function scrollDown(el, top) {
    // scrollDown(el, top)
    el.scrollTo({
        top: top,
        left: 0,
        behavior: "smooth"
    });
}

function scrollUp(el) {
    // scrollUp(el)
    el.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
}

function hideElement(el) {
    // hideElement(el)
    el.classList.add("hidden");
}

function showElement(el) {
    // showElement(el)
    el.classList.remove("hidden");
}

// responseDownload
const rd = document.getElementById("rd");

function responseDownloadOn() {
    // responseDwonloadOn()
    showElement(rd);
}

function responseDownloadOff() {
    // responseDownloadOff()
    hideElement(rd);
}

async function requestPost(path, data, callbackFunc=console.log, kwargs={}) {
    // requestPost(path, data, callbackFunc=console.log, kwargs={})
    responseDownloadOn();
    await fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken("csrftoken")
        },
        body: JSON.stringify(data)
    }).then(response => {
        kwargs.status = response.status;
        kwargs.statusText = response.statusText;
        return response.json();
    }).then(data => callbackFunc(data, kwargs));
    responseDownloadOff();
}

function getCSRFToken(name) {
    // getCSFRToken(name)
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const blockInputsContainer = document.getElementById("bic");

const mainCharacterInput = document.getElementById("mci");
const actionInput = document.getElementById("ai");
const detailsInput = document.getElementById("di");
const environmentInput = document.getElementById("ei");
const lightingInput = document.getElementById("li");
const moodInput = document.getElementById("mi");
const artStyleInput = document.getElementById("asi");
const cameraAnglesInput = document.getElementById("cai");

const allInputs = document.querySelectorAll("textarea");
const allClearBtn = document.querySelectorAll("[data-clear]");
const getBtn = document.getElementById("gb");

const blockResult = document.getElementById("br");
const blockResultContainer = document.getElementById("brc");
const backBtn = document.getElementById("bb");

function intro(el) {
    // intro(el)
    // :param el: HTML element
    setTimeout(function() {
        scrollDown(el, el.scrollHeight);
    }, 500);
    setTimeout(function() {
        scrollUp(el);
    }, 1000);
    setTimeout(function() {
        mainCharacterInput.focus();
    }, 1500);
}
intro(blockInputsContainer);

function animateCloseBtnOn(icon) {
    // animateOnCloseBtn(icon)
    // :param icon: HTML element <img/>
    // :global: showElement()
    icon.animate([{opacity: 0, rotate: "0deg"}, {opacity: 1, rotate: "90deg"}], 
        {duration: 300, easing: "ease-in", fill: "forwards"});
    showElement(icon);
    icon.classList.remove("fade");
}

function animateCloseBtnOff(icon) {
    // animateOffCloseBtn(icon)
    // :param icon: HTML element <img/>
    // :global func: hideElement()
    icon.animate([{opacity: 1, rotate: "90deg"}, {opacity: 0, rotate: "0deg"}], 
        {duration: 300, easing: "ease-out", fill: "backwards"});
    icon.classList.add("fade");
    setTimeout(() => {
        hideElement(icon);
    }, 300)
}

allInputs.forEach(i => i.addEventListener("input", () => {
    const icon = i.nextElementSibling;
    if(i.value.length == 0) {
        animateCloseBtnOff(icon);
    }else if(i.value.length == 1 && icon.classList.contains("fade")) {
        animateCloseBtnOn(icon);
    }
}))

allClearBtn.forEach(i => i.addEventListener("click", () => {
    const input = i.previousElementSibling;
    input.value = "";
    animateCloseBtnOff(i);
    input.focus();
}))

function promptToHtml(item) {
    // :param item: object
    return `<div class="text hidden" data-text>
                <p>${item}</p>
                <div class="separator"></div>
                <img class="icon copy-icon" data-copy src="/static/icons/copy.svg"/>
            </div>`
}

function copyText(text) {
    // ;param text: str
    try {
        navigator.clipboard.writeText(text);
    } catch(e) {
        console.log(`Failed to copy: ${e}`);
    }
}

let currentCopied = null;

function animatePasteText(textBlocks) {
    // :param textBlocks: array[HTML element] <div>
    let delay = 0;
    textBlocks.forEach(i => {
        delay += 500;
        setTimeout(() => {
            i.animate([{opacity: 0}, {opacity: 1}], 
                {duration: 500, easing: "ease-in", fill: "forwards"})
            showElement(i);
            }, delay
        );
    })
}

function animateRemoveText() {
    // :global func: hideElement()
    try {
        const textBlocks = document.querySelectorAll("[data-text]");
        textBlocks.forEach(i => {
            i.animate([{opacity: 1}, {opacity: 0}], 
                {duration: 500, easing: "ease-out", fill: "forwards"})
            setTimeout(() => {
                hideElement(i);
            }, 500)
        })
    } catch(e) {
        console.log("expected", e);
    }
    
}

function copyBtnsEventListener(copyBtns) {
    // :param copyBtns: array[HTML element] <img/>
    // :global var: currentCopied
    // :global func: copyText()
    copyBtns.forEach(i => i.addEventListener("click", function() {
        try {
            currentCopied.src = "/static/icons/copy.svg";
            currentCopied = null;
        } catch(e) {
            console.log("expected", e);
        }
        copyText(i.previousElementSibling.textContent);
        i.src = "/static/icons/accept-check-ok-prosess.svg";
        currentCopied = i;
    }));
}

function getBtnCallback(data) {
    // :param data: array[str]
    // :global var: blockResultContainer, blockResult, 
    // :global func: animatePasteText(), copyBtnsEventListener(), scrollDown()
    blockResultContainer.innerHTML = data.map(promptToHtml).join("");
    const textBlocks = document.querySelectorAll("[data-text]");
    animatePasteText(textBlocks);
    const copyBtns = document.querySelectorAll("[data-copy]");
    copyBtnsEventListener(copyBtns);
    blockResult.style.display = "block";
    scrollDown(window, document.body.scrollHeight);
}

getBtn.addEventListener("click", function() {
    const data = {
        "mainCharacter": mainCharacterInput.value ? mainCharacterInput.value : mainCharacterInput.placeholder,
        "action": actionInput.value ? actionInput.value : actionInput.placeholder,
        "details": detailsInput.value ? detailsInput.value : detailsInput.placeholder,
        "environment": environmentInput.value ? environmentInput.value : environmentInput.placeholder,
        "lighting": lightingInput.value ? lightingInput.value : lightingInput.placeholder,
        "mood": moodInput.value ? moodInput.value : moodInput.placeholder,
        "artStyle": artStyleInput.value ? artStyleInput.value : artStyleInput.placeholder,
        "cameraAngles": cameraAnglesInput.value ? cameraAnglesInput.value : cameraAnglesInput.placeholder
    }
    if(data.mainCharacter) {
        animateRemoveText();
        requestPost("/api/home/post", data, getBtnCallback);
    } else {
        mainCharacterInput.focus();
    }  
})

backBtn.addEventListener("click", function() {
    scrollUp(window);
    setTimeout(function() {
        blockResult.style.display = "none";
    }, 600);
})