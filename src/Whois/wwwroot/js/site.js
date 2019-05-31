var db = window.localStorage;

function store(key, val) {
    if (db) {
        db.setItem(key, JSON.stringify(val));
    }
}

function getObject(key, callback) {
    var obj = { data: null }; // for keep object reference when new data generated
    if (db) {
        obj.data = JSON.parse(db.getItem(key));
    }

    if (callback) {
        callback(obj);
        store(key, obj.data);
    }
}

var getCheckbox = function (id, content = "", isChecked = false, css = "", note = null, noteClass = "") {
    return '<div class=\"control custom-control custom-checkbox ' + (css ? css : '') + ' \"><input id=\"' + id + '\" type=\"checkbox\" class=\"custom-control-input\" ' +
        (isChecked ? "checked" : "") + ">" +
        '<label class=\"custom-control-label\" for=\"' + id + '\"><span class=\"checkbox-text\"><span class=\"checkbox-content\">' + content + '</span>' +
        (!note ? "" : '<span class=\"checkbox-note ' + noteClass + '\">("' + note + '")</span>') +
        '</span></label></div>';
}