/*
 * Editable plugin
 * 
 * Data attributes:
 * - data-control="example" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').editable({ option: 'value' })
 *
 * Dependences: 
 * - Some other plugin (filename.js)
 */

+function ($) { "use strict";

    // EDITABLE CLASS DEFINITION
    // ============================

    var Editable = function(element, options) {
        var self       = this
        this.options   = options
        this.$el       = $(element)

        this.originalHtml = null;
        this.requestHandler = this.$el.data('handler')
        this.editFile = this.$el.data('file')

        this.$controlPanel = $('<div />').addClass('control-editable')
        this.$edit = $('<button />').addClass('btn editable-edit-button').text('Edit').appendTo(this.$controlPanel)
        this.$save = $('<button />').addClass('btn editable-save-button').text('Save').hide().appendTo(this.$controlPanel)
        this.$cancel = $('<button />').addClass('btn editable-cancel-button').text('Cancel').hide().appendTo(this.$controlPanel)

        $(document.body).append(this.$controlPanel)

        this.$el.on('mouseleave', function(){ self.hideControlPanel() })
        this.$el.on('mouseenter', function(){ self.showControlPanel() })
        this.$controlPanel.on('mouseleave', function(){ self.hideControlPanel() })
        this.$controlPanel.on('mouseenter', function(){ self.showControlPanel() })

        this.$edit.on('click', function(){ self.clickEdit() })
        this.$save.on('click', function(){ self.clickSave() })
        this.$cancel.on('click', function(){ self.clickCancel() })
    }

    Editable.DEFAULTS = {
        option: 'default'
    }

    Editable.prototype.clickCancel = function() {
        this.$el.redactor('set', this.originalHtml)
        this.$el.redactor('destroy')
        this.refreshControlPanel()
        this.$controlPanel.removeClass('active')
        this.$edit.show()
        this.$save.hide()
        this.$cancel.hide()
    }

    Editable.prototype.clickSave = function() {
        var html = this.$el.redactor('get')
        this.$el.redactor('destroy')
        this.refreshControlPanel()
        this.$controlPanel.removeClass('active')
        this.$edit.show()
        this.$save.hide()
        this.$cancel.hide()
        $.request(this.requestHandler, {
            data: {
                file: this.editFile,
                content: html
            }
        })
    }

    Editable.prototype.clickEdit = function() {
        this.$el.redactor({ focus: true })
        this.refreshControlPanel()
        this.$controlPanel.addClass('active')
        this.$save.show()
        this.$cancel.show()
        this.$edit.hide()
        this.originalHtml = this.$el.redactor('get')
    }

    Editable.prototype.hideControlPanel = function() {
        this.$controlPanel.removeClass('visible')
    }

    Editable.prototype.refreshControlPanel = function() {
        this.$controlPanel
            .width(this.$el.outerWidth())
            .height(this.$el.outerHeight())
            .css({
                top: this.$el.offset().top,
                left: this.$el.offset().left + this.$el.outerWidth() - this.$controlPanel.outerWidth()
            })
    }
    
    Editable.prototype.showControlPanel = function() {
        this.$controlPanel.addClass('visible')
        this.refreshControlPanel()
    }

    // EDITABLE PLUGIN DEFINITION
    // ============================

    var old = $.fn.editable

    $.fn.editable = function (option) {
        var args = Array.prototype.slice.call(arguments, 1)
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.example')
            var options = $.extend({}, Editable.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.example', (data = new Editable(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.editable.Constructor = Editable

    // EDITABLE NO CONFLICT
    // =================

    $.fn.editable.noConflict = function () {
        $.fn.editable = old
        return this
    }

    // EDITABLE DATA-API
    // ===============

    $(document).on('mouseenter', '[data-control="editable"]', function() {
        $(this).editable()
    });

}(window.jQuery);
