const getArticleContentHtml = ({content, sources, introductionText}) => {
    let text = "";
    let has_intro = false;

    content.forEach((v) => {

        if (v.type == "video") {
            text += `<div class="video_container">${v.content}</div>`;
            return true;
        }

        if (v.type == "intro") {
            text += `<h5>${v.text}</h5>`;
            has_intro = true;
            return true;
        }

        if (v.type == "blockquote") {
            text += blockquote(v);
            return true;
        }

        if (v.type == "list") {
            text += list(v);
            return true;
        }

        if (v.type == "image") {
            text += image(v);
            return true;
        }

        text += `<h2>${v.header || ""}</h2>`;

        if (typeof v.text == "object") {
            text += getTextHtml(v.text);
            return true;
        }

        text += `<p>${v.text}</p>`;
    });

    if (sources) {
        text += '<div class="sources"><span>Źródła informacji i inspiracje:</span>';
        sources.forEach((v) => {
            text += `<span class="source"><a href="${v[1]}" target="_blank">${v[0]}</a></span>`;
        });
        text += `</div>`;
    }

    if (!has_intro) {
        text = `<h5>${introductionText}</h5>` + text;
    }

    return text;
}

const getTextHtml = content => {
    let toReturn = "";

    content.forEach((data) => {

        if (typeof data == "object") {

            if (data.type == "blockquote") {
                toReturn += blockquote(data);
                return true;
            }

            if (data.type == "list") {
                toReturn += list(data);
                return true;
            }

            if (data.type == "image") {
                toReturn += image(data);
                return true;
            }

            toReturn += `<h3>${data.header || ""}</h3><p>${data.text || data.content || ""}</p>`;
            return true;
        }

        toReturn += `<p>${data}</p>`;
    });

    return toReturn;
}

const blockquote = data => {
    return `
    <blockquote cite="${data.source || ""}">
        <div>${data.text}</div>
        <div class="cite_src">${new URL(data.source).host}</div>
    </blockquote>`;
}

const list = data => {
    let listItems = "";

    data.content.forEach(v => {
        listItems += `<li>${v}</li>`;
    });

    if (data.listType == "unordered" || !data.listType) {
        return `<ul>${listItems}</ul>`;
    }

    return `<ol>${listItems}</ol>`;
}

const image = data => {
    return `
    <div data-showSource="${data.showSource}" data-ImgSource="${new URL(data.source).host}" class="image">
        <img src="${data.source}"/>
    </div>`;
}

export default getArticleContentHtml;

//© Wiktor Golicz 2021 - WSZELKIE PRAWA ZASTRZEŻONE