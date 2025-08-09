let selectedFile = "";
let editor;
let enhancedEditor;
let _getFileUrl = "";
let _saveFileUrl = "";
let isEnhanced = false;

function Initialize(getFileUrl, saveFileUrl) {
	_getFileUrl = getFileUrl;
	_saveFileUrl = saveFileUrl;

	editor = new JsonEditor('#json-display');
	const container = document.getElementById("jsoneditor");
	const options = {
		mode: 'tree'
	};
	enhancedEditor = new JSONEditor(container, options);

	$('#jsoneditor').hide();

	let firstFile = $(".list-files li:first button");
	onClickFileLink(firstFile, firstFile.data("filename"));
}

function toggleEditor() {
	isEnhanced = $('#editor-toggle').is(':checked');
	if (isEnhanced) {
		$('#json-display').hide();
		$('#jsoneditor').show();
	} else {
		$('#jsoneditor').hide();
		$('#json-display').show();
	}
}

function getJson(jsonContents) {
	try {
		return JSON.parse(jsonContents);
	} catch (ex) {
		alert('Wrong JSON Format: ' + ex);
	}
}

function openFileContents(fileName) {
	showLoading();
	selectedFile = fileName;
	var url = `${_getFileUrl}?fileName=${fileName}`;
	$.get(url, function (response) {
		var content = getJson(response.data);
		editor.load(content);
		enhancedEditor.set(content);
		hideLoading();
	});
}

function onClickFileLink(link, fileName) {
	$(".list-files").find("button").removeClass("selected");
	$(link).addClass("selected");
	openFileContents(fileName);
}

function onReloadClick() {
	openFileContents(selectedFile);
}

function saveFileContents() {
	try {
		showLoading();
		let fileName = selectedFile;
		let content;
		if (isEnhanced) {
			content = enhancedEditor.get();
		} else {
			content = editor.get();
		}
		let url = _saveFileUrl;
		$.post(url, { fileName: fileName, content: JSON.stringify(content, null, 2) }, function (response) {
			if (!response.success) {
				alert(response.error);
			}
			else {
				alert("File saved successfully!");
			}
			hideLoading();
		});
	}
	catch (ex) {
		hideLoading();
		alert(ex);
	}
}
