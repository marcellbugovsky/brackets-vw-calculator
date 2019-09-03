//MIT Licensed

define(function (require, exports, module) {

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        WorkspaceManager = brackets.getModule("view/WorkspaceManager"),
        MainViewManager = brackets.getModule("view/MainViewManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    var editor;
    var cursorPos;
    var panelVisible = false;
    var $panelHtml = $(require("text!panel.html"));
    var keybinding = "Alt-V";

    ExtensionUtils.loadStyleSheet(module, 'style.css');

    $panelHtml.appendTo('body').on('mouseleave', function () {
        panelHide();
    });

    // Shwoing or hiding the panel 
    function handleCalcPanel() {
        if (!panelVisible) {
            editor = EditorManager.getActiveEditor();
            cursorPos = editor.getCursorPos();
            panelShow();
        } else {
            panelHide();
        }
    }
    
    function panelHide() {
        panelVisible = false;
        $panelHtml.hide();
        MainViewManager.focusActivePane();
    }
    
    function panelShow() {
        panelVisible = true;
        $panelHtml.show();
        $("#vwcalc #type-a-value").focus();
    }
    
    // Events start here
    $("#vwcalc #type-a-value").keypress(function (e) {//Changes the vw whenever someone types in the input
        if (e.which != 13) {
            $("#result-vw").val(
                (Math.round((parseFloat((($("#type-a-value").val()) / parseFloat($("#screen-x").val()) * 100)|| 0)) * 100) / 100) + "vw"
            );
        } else {
            panelHide();
            editor.document.replaceRange($("#vwcalc #result-vw").val(), cursorPos);
        }
    });
    
    $("vwcalc #type-a-value").keypress(function (e) {
        if (e.which == 13) {
            panelHide();
            editor.document.replaceRange($("#vwcalc #result-vw").val(), cursorPos);
        }
    });
    
    $("#vwcalc td button").click(function () {
        panelHide();
        editor.document.replaceRange($("#vwcalc #result-vw").val(), cursorPos);
    });
    // Events until here

    // First, register a command - a UI-less object associating an id to a handler
    var MY_COMMAND_ID = "marcellbugovsky.personalcalculator";
    CommandManager.register("VW calculator 2.0", MY_COMMAND_ID, handleCalcPanel);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(MY_COMMAND_ID, keybinding);

});
