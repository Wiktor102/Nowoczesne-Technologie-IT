let params = new URLSearchParams(window.location.search);

const getUrlParam = (key, ifDelete = false) => {
    const param = params.get(key);

    if (ifDelete) {
        deleteUrlParam(key);
    }

    return param;
}

const setUrlParam = (key, value) => {
    params.set(key, value);
    refreshUrlParam();
}

const deleteUrlParam = key => {
    params.delete(key);
    refreshUrlParam();
}

const refreshUrlParam = () => {
    const newUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.pushState({path:newUrl}, "", newUrl);
}

if (getUrlParam("a") == null) {
    setUrlParam("a", 0)
}

export {setUrlParam, getUrlParam, deleteUrlParam, refreshUrlParam};

//© Wiktor Golicz 2021 - WSZELKIE PRAWA ZASTRZEŻONE