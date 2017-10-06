# autoCompleteMe (Work on Progress)
Bootstrap 3-4 fully customizable #hashtag, @mention autocomplete extension 

For more details -> demo.html

=======================

# Options

```javascript
var opts = {
            delimiters: ['@'], 
            debug: false,
            sensitive: true, // case sensitive
            queryBy: ["name", "username"], // fields to query
            minCharacter: 2, // min character count to search
            asyncAddress: false, // ajax post request url for data
            itemTemplate: '<li data-value="{username}" class="dropdown-item {isActive}">\n' +
            '                        <a href="javascript:;"><img class="mention_image" src="{image}">\n' +
            '                            <b class="mention_name">{name}</b>\n' +
            '                            <span class="mention_username">{username_delimiter}</span>\n' +
            '                        </a>\n' +
            '                    </li>', // check demo.html
            dropDownClass: '', // add. class for dropdown tag
            staticData: [] // you can use static data, for format, demo.html
        };
```


Thanks...

Inspired by https://github.com/jakiestfu/Mention.js/
