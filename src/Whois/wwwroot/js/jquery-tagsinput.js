(function ($) {
    'use strict';

    $.fn.tagsInput = function (options) {
        var settings = $.extend({
            tagClass: 'badge badge-primary',
            tagsContainerClass: 'form-control',
            highlightColor: '#ffc107'
        }, options);

        var ATTR_RENDERED = 'data-rendered';
        var ATTR_DISABLED = 'disabled';
        var TRUE = 'true';
        var helpers = new Helpers();
        var tagRemoveIconTemplate = '<i class="tag-remove">&#10006;</i>';
        var tagTemplate = function (isDisabled) {
            return helpers.fillIn('<div class="tag {tagClass}"><span>{value}</span>{tagRemoveIcon}</div>', {
                'tagClass': helpers.sanitizeText(settings.tagClass),
                'tagRemoveIcon': isDisabled ? '' : tagRemoveIconTemplate
            });
        }
        var tagsContainerTemplate = function (isDisabled) {
            return helpers.fillIn('<div class="tags-container {tagsContainerClass} {state}"><input type="text" size="1" {state}><div>', {
                'tagsContainerClass': helpers.sanitizeText(settings.tagsContainerClass),
                'state': isDisabled ? 'disabled' : ''
            });
        }

        /** Render TagsInput elements */
        this.each(function () {
            if (this.hasAttribute(ATTR_RENDERED)) {
                return;
            }

            var isDisabled = this.hasAttribute(ATTR_DISABLED);
            var tTag = tagTemplate(isDisabled);
            var tTagsContainer = tagsContainerTemplate(isDisabled);

            var $that = $(this);
            var tagElems = [];
            var hiddenValue = $that.val();
            if (hiddenValue) {
                $.each(hiddenValue.split(';'), function (index, value) {
                    var v = value.trim();
                    if (v.length > 0) {
                        tagElems.unshift(jQuery(tTag.replace('{value}', v)));
                    }
                });
            }

            var tagsContainerElem = $(tTagsContainer);
            $.each(tagElems, function (index, value) {
                tagsContainerElem.prepend(value);
            });
            $that.after(tagsContainerElem);
            $that.attr('hidden', TRUE);
            $that.attr(ATTR_RENDERED, TRUE);


        });

        /** Register events */
        $('i.tag-remove').click(helpers.removeTag);

        $('.tags-container').not('disabled').click(function (e) {
            $(this).children('input').focus();
        });

        $('.tags-container').not('disabled').children('input').bind('input', function (e) {
            helpers.resetSize(this);
        });

        var activeTagTemplate = tagTemplate(false);
        $('.tags-container').not('disabled').children('input').keydown(function (e) {
            if (e.key === 'Enter' || e.key === ';' || e.key === ' ') {
                e.preventDefault();
                var input = $(e.currentTarget);
                var values = input.val().trim().split(' ');
                values.forEach(value => {
                    if (value) {
                        value = helpers.sanitizeText(value);
                        var existingSpan = input.siblings('div').filter(function () {
                            return ($(this).find('span').text() === value);
                        });
                        if (existingSpan.length > 0) {
                            if (!settings.hasOwnProperty('tagColor')) {
                                settings.tagColor = existingSpan.css('background-color');
                            }
                            helpers.blink(existingSpan, settings.highlightColor, settings.tagColor);
                        } else {
                            var newTag = $(activeTagTemplate.replace('{value}', value));
                            newTag.insertBefore(input);
                            newTag.children('i').click(helpers.removeTag);

                            var hiddenInput = $(this).parent().prev();
                            var oValue = hiddenInput.val();
                            if (oValue.length > 0 && oValue.charAt(oValue.length - 1) !== ';') {
                                oValue += ';';
                            }
                            input.val('');
                            helpers.resetSize(input);
                            hiddenInput.val(oValue.concat(value).concat(';'));
                        }
                    }
                });
                return false;
            }
            else if (e.keyCode === 8) {
                if ($(e.currentTarget).val() === "") {
                    $(this).prev("div.tag").remove();
                }
            }
        });
    }

    /*** Helper functions declaration ***/
    function Helpers() { }

    Helpers.prototype.resetSize = function (target) {
        var $target = $(target);
        var len = $target.val().length;
        $target.attr('size', (len < 1) ? 1 : len);
    }

    Helpers.prototype.removeTag = function (e) {
        var $that = $(this);
        var parent = $that.parent();
        var hiddenInput = parent.parent().prev();
        var text = $that.siblings('span').text();
        var hValue = hiddenInput.val();
        var pattern = `(^${text};)|(;${text};)`;
        var result = hValue.replace(new RegExp(pattern, 'u'), ';');
        hiddenInput.val(result);
        parent.remove();
    }

    Helpers.prototype.sanitizeText = function (raw) {
        return $('<div>').text(raw).html();
    }

    Helpers.prototype.blink = function (target, highlightColor, tagColor) {
        var $target = $(target);
        $target.stop().animate({
            backgroundColor: highlightColor
        }, 200).promise().done(function () {
            $target.animate({
                backgroundColor: tagColor
            }, 200);
        });
    }

    Helpers.prototype.fillIn = function (stringTemplate, variables) {
        return stringTemplate.replace(new RegExp("\{([^\{]+)\}", "g"), function (_unused, varName) {
            return variables[varName] === undefined ? '{'.concat(varName).concat('}') : variables[varName];
        });
    }

})(jQuery);