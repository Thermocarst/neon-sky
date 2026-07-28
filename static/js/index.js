

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

function animateEl(el, animation, duration=300, easing="ease-in", fill="forwards") {
    // :param el: HTML element
    // :param animation: list[object, object] (from, to)
    // :param duration: int
    // :param easing: str ("ease-in", "ease-out", etc.)
    // :param fill: str ("forwards", "backwards")
    el.animate(animation, 
        {duration: duration, easing: easing, fill: fill}
    );
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
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify(data)
    }).then(response => {
        kwargs.status = response.status;
        kwargs.statusText = response.statusText;
        return response.json();
    }).then(data => callbackFunc(data, kwargs));
    responseDownloadOff();
}

function getCookie(name) {
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

const content = document.getElementById("content");

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
    // :global: animateEl(), showElement()
    animateEl(icon, [{opacity: 0, rotate: "0deg"}, {opacity: 1, rotate: "90deg"}])
    // icon.animate([{opacity: 0, rotate: "0deg"}, {opacity: 1, rotate: "90deg"}], 
    //     {duration: 300, easing: "ease-in", fill: "forwards"});
    showElement(icon);
    icon.classList.remove("fade");
}

function animateCloseBtnOff(icon) {
    // animateOffCloseBtn(icon)
    // :param icon: HTML element <img/>
    // :global func: hideElement()
    animateEl(icon, [{opacity: 1, rotate: "90deg"}, {opacity: 0, rotate: "0deg"}], 
        300, "ease-out", "backwards")
    // icon.animate([{opacity: 1, rotate: "90deg"}, {opacity: 0, rotate: "0deg"}], 
    //     {duration: 300, easing: "ease-out", fill: "backwards"});
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
            animateEl(i, [{opacity: 0}, {opacity: 1}], 500);
            // i.animate([{opacity: 0}, {opacity: 1}], 
            //     {duration: 500, easing: "ease-in", fill: "forwards"})
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
            animateEl(i, [{opacity: 1}, {opacity: 0}], 500, "ease-out");
            // i.animate([{opacity: 1}, {opacity: 0}], 
            //     {duration: 500, easing: "ease-out", fill: "forwards"})
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
    console.log("qw", data)
    blockResultContainer.innerHTML = data.map(promptToHtml).join("");
    const textBlocks = document.querySelectorAll("[data-text]");
    animatePasteText(textBlocks);
    const copyBtns = document.querySelectorAll("[data-copy]");
    copyBtnsEventListener(copyBtns);
    blockResult.style.display = "block";
    scrollDown(window, document.body.scrollHeight);
}

getBtn.addEventListener("click", () => {
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
        const lang = getCookie("django_language");
        requestPost(`/${lang}/api/home/post`, data, getBtnCallback);
    } else {
        mainCharacterInput.focus();
    }
})

backBtn.addEventListener("click", () => {
    scrollUp(window);
    setTimeout(() => {
        blockResult.style.display = "none";
    }, 600);
})

// i18n
const languageBtn = document.getElementById("language");
const languageArrow = document.getElementById("language-icon");
const languageList = document.getElementById("language-list");
const allOption = document.querySelectorAll("[data-lang]");
allOption.forEach(i => i.addEventListener("click", () => {
    const lang = i.textContent.trim();
    const currentLang = languageBtn.textContent.trim().split(" ")[0].trimEnd();
    console.log(lang, currentLang)
    if(lang != currentLang) {
        document.cookie = "django_language=" + lang + ";domain=;path=/";
        location.href= `/${lang}${window.location.pathname.slice(3, window.location.pathname.length)}`;
    }
}))

function hideOnMissClick(e) {
    // if(!e.target.closest("#language-list")) {
        console.log("qq")
    if(!languageList.contains(e.target)) {
        hideLanguageDD();
    }
}

function hideLanguageDD() {
    languageList.classList.remove("open");
    animateEl(languageArrow, [{rotate: "0deg"}, {rotate: "180deg"}]);
    content.removeEventListener("click", hideOnMissClick);
}

languageBtn.addEventListener("click", () => {
    if(languageList.classList.contains("open")) {
        hideLanguageDD();
    } else {
        languageList.classList.add("open");
        animateEl(languageArrow, [{rotate: "-180deg"}, {rotate: "0deg"}]);
        content.addEventListener("click", hideOnMissClick);
    }  
})