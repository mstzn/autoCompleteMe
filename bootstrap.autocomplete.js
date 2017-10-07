;(function ($) {
    var autoComplete = function ($elm, settings) {
        var $this = $elm;
        var ajaxProcessing = false;
        var getDelimiterIndex = function (pos) {
            var index = -1;
            var spaceFound = false;
            for (var i = pos; i > 0; i--) {
                var val = $this.val();
                var prevChar = val.substr(i - 1, 1);

                for (var d = 0; d < settings.delimiters.length; d++) {
                    if (prevChar == " ") {
                        log("space found");
                        spaceFound = true;
                        break;
                    }
                    if (prevChar == settings.delimiters[d]) {
                        log("char found");
                        index = i;
                        break;
                    }
                }
                if (index > -1 || spaceFound == true)
                    break;
            }
            log("delimiter index: " + index);
            return index;
        }, resetComplete = function () {
            $this.closest("div").find(".autoComplete").slideUp(100, function () {
                $(this).remove();
            });
        }, getCursorPosition = function () {
            return $this.caret();
        }, getCursorPositionInPixel = function () {
            return $this.getCaretPosition();
        }, getNextStop = function () {
            var pos = getCursorPosition();
            var val = $this.val();
            var len = $this.val().length;
            var stops = [" ", ".", ",", ";", ":", "-"];
            if (pos == len) {
                return pos;
            }
            for (i = pos; i < len; i++) {
                if (stops.indexOf(val.substr(i, 1))) {
                    return i;
                }
            }
            return -1;
        }, setCaretToPos = function (selectionStart, selectionEnd) {
            $this.caret(selectionStart, selectionEnd);
        }, getCompleteItems = function (delimiterIndex, delimiter, itemsToShow) {
            if (itemsToShow.length > 0) {
                var appendHtml = '';
                if (itemsToShow.length > 0) {
                    for (item in itemsToShow) {
                        appendHtml += settings.itemTemplate.replace("{isActive}", (item == 0 ? 'active' : '')).replace("{name}", itemsToShow[item]["name"]).replace("{image}", itemsToShow[item]["image"]).replace("{username_delimiter}", delimiter + itemsToShow[item]["username"]).replace('{username}', itemsToShow[item]["username"]);
                    }
                }
                var $holder = $('<ul class="autoComplete dropdown-menu" style="left:' + (getCursorPositionInPixel().left - 10) + 'px; top:' + (getCursorPositionInPixel().top + 40) + 'px"></ul>');
                if (settings.dropDownClass != "") {
                    $holder.addClass(settings.dropDownClass);
                }
                $holder.append(appendHtml);
                $this.closest("div").find(".autoComplete").slideUp(100, function () {
                    $(this).remove();
                });
                $this.closest("div").append($holder);
                $this.closest("div").find(".autoComplete").slideDown(100);


                $holder.find('.dropdown-item').on('click', function () {
                    selectAnItem();
                });

            } else {
                resetComplete();
            }
        }, selectAnItem = function () {
            var pos = getCursorPosition();
            var t = $this.val();
            var nextPos = getNextStop();
            if (nextPos != -1) {
                delimiterIndex = getDelimiterIndex(pos);
                var username = $(".autoComplete").find(".dropdown-item.active").data("value") + " ";
                log("item choosen: " + username);
                log("choosen delimiterIndex:" + delimiterIndex);
                log("choosen nextPost: " + nextPos);
                $this.val(t.substr(0, delimiterIndex) + username + t.substr(nextPos - 1, t.length - nextPos - 1));
                var curPos = delimiterIndex + username.length;
                setCaretToPos(curPos, curPos + 1);
                resetComplete();
            }
        }, switchToNext = function () {
            if ($(".autoComplete").length > 0 && $(".autoComplete").is(":visible")) {
                if ($(".autoComplete").find(".dropdown-item.active").next().length > 0) {
                    $(".autoComplete").find(".dropdown-item.active").removeClass("active").next().addClass("active");
                } else {
                    $(".autoComplete").find(".dropdown-item.active").removeClass("active");
                    $(".autoComplete").find(".dropdown-item:first-child").addClass("active");
                }
            }
        }, switchToPrev = function () {
            if ($(".autoComplete").length > 0 && $(".autoComplete").is(":visible")) {
                if ($(".autoComplete").find(".dropdown-item.active").prev().length > 0) {
                    $(".autoComplete").find(".dropdown-item.active").removeClass("active").prev().addClass('active');
                } else {
                    $(".autoComplete").find(".dropdown-item.active").removeClass("active");
                    $(".autoComplete").find(".dropdown-item:last-child").addClass("active");
                }
            }
        }, log = function (thing) {
            if (settings.debug == true) {
                console.log(thing);
            }
        };

        $this.on("keydown", function (event) {
            if (event.which == 13 || event.which == 40 || event.which == 38) {
                event.preventDefault();
            }
        });

        $this.on("keyup", function (event) {
            var pos = getCursorPosition();
            var delimiterIndex;
            var val = $this.val();

            log("Cursor:" + pos);

            // 27 ESC 32 Space 13 Return 40 Down 38 Up
            if (event.which == 27 || event.which == 32) {
                resetComplete();
                return;
            }
            if (event.which == 13) {
                if ($(".autoComplete").length > 0 && $(".autoComplete").is(":visible")) {
                    selectAnItem();
                }
                return;
            }
            if (event.which == 40) {
                switchToNext();
                return;
            }
            if (event.which == 38) {
                switchToPrev();
                return;
            }

            if (pos > 0) {
                delimiterIndex = getDelimiterIndex(pos);
                log(delimiterIndex);
                if (delimiterIndex > -1) {
                    if (pos - delimiterIndex > settings.minCharacter) {
                        var query = val.substr(delimiterIndex, pos - delimiterIndex);
                        var delimiter = val.substr(delimiterIndex - 1, 1);

                        if (query != "") {
                            log(delimiter + "+" + query);

                            if (settings.asyncAddress != "") {
                                if (ajaxProcessing) return;
                                ajaxProcessing = true;
                                $.post(settings.asyncAddress, {delimiter: delimiter, query: query}, function (result) {
                                    getCompleteItems(delimiterIndex, delimiter, result);
                                    ajaxProcessing = false;
                                }, 'json').fail(function () {
                                    ajaxProcessing = false;
                                })
                            } else {
                                var itemsToShow = [];
                                for (idx in settings.staticData) {
                                    for (var q = 0; q < settings.queryBy.length; q++) {
                                        log(settings.queryBy[q] + "-" + query);
                                        var re = new RegExp(query, "g" + (!settings.sensitive ? 'i' : ''));
                                        if (settings.staticData[idx][settings.queryBy[q]].search(re) != -1) {
                                            itemsToShow.push(settings.staticData[idx]);
                                            log(settings.staticData[idx]);
                                        }
                                    }
                                }
                                getCompleteItems(delimiterIndex, delimiter, itemsToShow);
                            }

                        } else {
                            resetComplete();
                        }
                    } else {
                        resetComplete();
                    }
                }
            }
        });

        return $this;
    };

    $.fn.autoCompleteMe = function (options) {
        var opts = {
            delimiters: ['@'],
            debug: false,
            sensitive: true,
            queryBy: ["name", "username"],
            minCharacter: 2,
            asyncAddress: false,
            itemTemplate: '<li data-value="{username}" class="dropdown-item {isActive}">\n' +
            '                        <a href="javascript:;"><img class="mention_image" src="{image}">\n' +
            '                            <b class="mention_name">{name}</b>\n' +
            '                            <span class="mention_username">{username_delimiter}</span>\n' +
            '                        </a>\n' +
            '                    </li>',
            dropDownClass: '',
            staticData: []
        };
        opts = $.extend({}, opts, options);

        return this.each(function () {
            new autoComplete($(this), opts);
        });
    }
})(jQuery);
