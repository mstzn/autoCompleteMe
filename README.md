# autoCompleteMe (Work on Progress)
Bootstrap 3-4 fully customizable #hashtag, @mention autocomplete extension 

For more details -> demo.html

=======================

# Options

```javascript
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
```
