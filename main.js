//MIT Licensed

define(function (require, exports, module) {

    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        MainViewManager = brackets.getModule("view/MainViewManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    var panel = $(require("text!panel.html"));
    var keybinding = "Alt-V";
    
    var editor;
    var cursorPos;
    var panelVisible = false;

    // Setting up the panel
    ExtensionUtils.loadStyleSheet(module, 'style.css');
    panel.appendTo('body').on('mouseleave', function () {
        panelHide();
    });
    
    // Setting some variables for DOM targetting within the panel
    var inputWidth = $("#vwcalc #vw-calc-container #screen-x");
    var inputpx = $("#vwcalc #vw-calc-container #type-a-value");
    var output = $("#vwcalc #vw-calc-container #result-vw");

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
        panel.hide();
        MainViewManager.focusActivePane();
    }
    
    function panelShow() {
        panelVisible = true;
        panel.show();
        inputpx.focus();
    }
    
    function insert() {
        panelHide();
        editor.document.replaceRange(output.val(), cursorPos);
    }
    
    // Events start here
    inputpx.keyup(function (e) {// Triggeres whenever a key is pressed
        if (e.which != 13 && e.which != 27) { // Whenever any key exept enter is pressed
            output.val(
                (Math.round((parseFloat(((inputpx.val()) / parseFloat(inputWidth.val()) * 100)|| 0)) * 100) / 100) + "vw"
            );
        } else if (e.which == 13) { // When enter is pressed we are done
            insert();
        } else {
            panelHide();
        }
    });
    
    // When the button is pressed we are done too
    $("#vwcalc td button").click(function () {
        insert();
    });
    // Events until here

    // Now register the command (UI-less)
    var COMMAND_ID = "marcellbugovsky.vwcalculator";
    CommandManager.register("VW calculator", COMMAND_ID, handleCalcPanel);

    // Then create a menu item bound to the command
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    if (menu) {
        menu.addMenuDivider();
        menu.addMenuItem(COMMAND_ID, keybinding);
    }

});
