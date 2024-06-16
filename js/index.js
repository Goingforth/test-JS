const allowDrop = (event) => event.preventDefault();
document.ondragover = allowDrop;
document.ondrop = allowDrop;
document.ondragend = allowDrop;

const btn = document.getElementById('btn');
const form = document.querySelector('form');


const inputLength = () => input.value.length === 0 ? btn.disabled = true : btn.disabled = false;
input.addEventListener("input", inputLength);

btn.onclick = (e) => {
    e.preventDefault();
    createElementDIV();
}
btn.onmousedown = (e) => {
    e.preventDefault();
}

const createElementDIV = () => {

    const nextElement = form.nextElementSibling;
    if (nextElement.nodeName === "DIV" && nextElement.className === 'breaking') { nextElement.remove() }
    const divSpan = document.createElement('div');
    divSpan.setAttribute("id", "place");
    const inputText = input.value.split('');
    input.value = "";
    btn.disabled = true;

    divSpan.classList.add('breaking');
    form.insertAdjacentElement('afterend', divSpan);
    createSpanAndText(divSpan, inputText)

}

//////////

let listID = [];
const img = new Image();
img.src = "../image.gif";

const dragStart = (e) => {
    if (listID.length === 0) {
        e.dataTransfer.setData("text", e.target.id);
        e.dataTransfer.setData("drag", "single");
    }
    else {
        e.dataTransfer.setData('array', JSON.stringify(listID));
        e.dataTransfer.setData("drag", "multi");
        e.dataTransfer.setDragImage(img, e.offsetX, e.offsetY);
    }

};

const onClick = (e) => {
    if (ctrlDownTrue) { document.getElementById(e.target.id).classList.toggle("marked"); listID.push(e.target.id) }
}

const setDraggable = (span) => {
    span.setAttribute("draggable", "true");
    span.setAttribute("ondragstart", "dragStart(event)");
    span.setAttribute("onclick", "onClick(event)");
}

const createSpanAndText = (div, inputText) => {
    inputText.forEach((symbol, index) => {
        const span = document.createElement('span');
        span.textContent = symbol;
        span.setAttribute("id", `${index}`);
        setDraggable(span);
        div.appendChild(span);

    })
}


//
const swapStyleSpan = (span1, span2) => {
    const span1StyleTop = span1.style.top;
    const span1StyleLeft = span1.style.left;

    const span2StyleTop = span2.style.top;
    const span2StyleLeft = span2.style.left;

    span1.style.top = span2StyleTop;
    span1.style.left = span2StyleLeft;

    span2.style.top = span1StyleTop;
    span2.style.left = span1StyleLeft
}


const dropSingle = (e, divSpan) => {
    const itemID = e.dataTransfer.getData("text");
    let item = document.getElementById(itemID);
    if (document.elementFromPoint(e.clientX, e.clientY).localName === "html") {
        const divSpanHTML = divSpan.innerHTML;

        item.classList.add("positionAbs");
        item.style.top = `${e.clientY}px`;
        item.style.left = `${e.clientX}px`;

        const { width, height } = item.getBoundingClientRect();
        const emptySpan = `<span id=empty${itemID} draggable="true" ondragstart="dragStart(event)" onclick="onClick(event)"style="width: ${width}px; height: ${height}px;" ></span>`
        const newDivSpan = divSpanHTML.split("</span>").filter(el => el)
        ///////
        newDivSpan.forEach((str, i) => newDivSpan[i] = str + "</span>")
        const proviso = "id=" + "\"" + `${itemID}` + "\"";
        const indexDragSpan = newDivSpan.findIndex((item) => item.includes(proviso));
        newDivSpan[indexDragSpan] = emptySpan;
        ///
        /////////////  drop span
        divSpan.insertAdjacentElement('afterend', item);
        divSpan.innerHTML = newDivSpan.join("")

    }

    else {
        const returnSpan = document.elementFromPoint(e.clientX, e.clientY);

        if (returnSpan.classList.value === item.classList.value) {
            swapStyleSpan(returnSpan, item);

        }
        else {
            const spanStyleTop = returnSpan.style.top;
            const spanStyleLeft = returnSpan.style.left;

            returnSpan.classList.remove("positionAbs");
            returnSpan.removeAttribute("style");

            const divSpanHTML = divSpan.innerHTML;

            item.classList.add("positionAbs");
            item.style.top = spanStyleTop;
            item.style.left = spanStyleLeft;

            const newDivSpan = divSpanHTML.split("</span>").filter(el => el)
            newDivSpan.forEach((str, i) => newDivSpan[i] = str + "</span>")
            const proviso = "id=" + "\"" + `${itemID}` + "\"";
            const indexDragSpan = newDivSpan.findIndex((item) => item.includes(proviso));
            newDivSpan[indexDragSpan] = returnSpan.outerHTML;

            returnSpan.remove();

            divSpan.insertAdjacentElement('afterend', item);
            divSpan.innerHTML = newDivSpan.join("")
        }
    }

}


const dropMulti = (e, divSpan) => {
    const idDrop = JSON.parse(e.dataTransfer.getData("array"));

    let offsetSpan = 0;
    idDrop.forEach((itemID) => {
        const divSpanHTML = divSpan.innerHTML;
        const item = document.getElementById(itemID);
        item.classList.remove("marked");
        item.classList.add("positionAbs");
        item.style.top = `${e.clientY}px`;
        item.style.left = `${e.clientX + offsetSpan}px`;
        ///
        const { width, height } = item.getBoundingClientRect();
        const emptySpan = `<span id=empty${itemID} draggable="true" ondragstart="dragStart(event)" onclick="onClick(event)"style="width: ${width}px; height: ${height}px;" ></span>`
        const newDivSpan = divSpanHTML.split("</span>").filter(el => el)
        newDivSpan.forEach((str, i) => newDivSpan[i] = str + "</span>")
        const proviso = "id=" + "\"" + `${itemID}` + "\"";
        const indexDragSpan = newDivSpan.findIndex((item) => item.includes(proviso));
        newDivSpan[indexDragSpan] = emptySpan;
        //////
        offsetSpan = offsetSpan + item.offsetWidth;
        divSpan.insertAdjacentElement('afterend', item);
        divSpan.innerHTML = newDivSpan.join("");

    })

    listID = [];

}


const drop = (e) => {
    const drag = e.dataTransfer.getData("drag");
    const divSpan = document.querySelector("#place");
    if (drag === "single") {
        dropSingle(e, divSpan);
    }
    else {
        dropMulti(e, divSpan);
    }
}

document.ondrop = drop;

/////////////
const getCursorPosition = (e) => {

    if (e) {
        if (e.pageX || e.pageX == 0) return [e.pageX, e.pageY];
        let dE = document.documentElement || {};
        let dB = document.body || {};
        if ((e.clientX || e.clientX == 0) && ((dB.scrollLeft || dB.scrollLeft == 0) || (dE.clientLeft || dE.clientLeft == 0))) return [e.clientX + (dE.scrollLeft || dB.scrollLeft || 0) - (dE.clientLeft || 0), e.clientY + (dE.scrollTop || dB.scrollTop || 0) - (dE.clientTop || 0)];
    }
    return null;
}

let arraySpanbyID = [];
const getArraySpan = () => {
    const divSpan = document.getElementById("place")
    const arraySpan = divSpan.getElementsByTagName("span");
    arraySpanbyID = [];
    for (let elem of arraySpan) {
        arraySpanbyID.push({ id: elem.id, clientX: elem.getBoundingClientRect().x, clientY: elem.getBoundingClientRect().y })
    }

}

const mousedown = (e) => {

    if (e.target.id === "place") {

        listID = [];
        arraySpanbyID = []
        let mxy = getCursorPosition(e);

        getArraySpan();

        let box = document.createElement("div")
        box.setAttribute("id", "sel_box");
        const divSpan = document.querySelector("#place")
        divSpan.insertAdjacentElement('afterend', box);
        box.orig_x = mxy[0];
        box.orig_y = mxy[1];
        box.style.left = mxy[0] + "px";
        box.style.top = mxy[1] + "px";
        box.style.display = "block";
        document.onmousemove = mousemove;
        document.onmouseup = mouseup;
    }

}

const mousemove = (e) => {


    let mxy = getCursorPosition(e);

    const box = document.getElementById("sel_box");
    arraySpanbyID.forEach(({ id, clientX }) => {
        if ((clientX >= box.orig_x && clientX <= mxy[0]) || (clientX <= box.orig_x && clientX >= mxy[0])) {

            document.getElementById(id).classList.add("marked");
        }
        else {


            document.getElementById(id).classList.remove("marked");
        }
    })
    if (mxy[0] - box.orig_x < 0) {
        box.style.left = mxy[0] + "px";

    }
    if (mxy[1] - box.orig_y < 0) {
        box.style.top = mxy[1] + "px";
    }
    box.style.width = Math.abs(mxy[0] - box.orig_x) + "px";
    box.style.height = Math.abs(mxy[1] - box.orig_y) + "px";
}

const mouseup = (e) => {
    let box = document.getElementById("sel_box");
    box.remove();
    document.onmousemove = function () { };
    document.onmouseup = function () { };
    let markedSpan = [];
    markedSpan = [...document.getElementsByClassName("marked")];


    markedSpan.forEach((span) => { listID.push(span.id) })

}

document.onmousedown = mousedown;
/////
let ctrlDownTrue = false;
const ctrlDown = (e) => {
    if ((e.code === "ControlLeft" || e.code === "ControlRight")) { ctrlDownTrue = true }
}
const ctrlUP = (e) => { if ((e.code === "ControlLeft" || e.code === "ControlRight")) { ctrlDownTrue = false } }
document.addEventListener('keydown', ctrlDown);
document.addEventListener('keyup', ctrlUP);