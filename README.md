# Super Enums Factory: `SEnum(list)`

Enums are great, for reducing a list of values, keys, labels, etc

> In computer programming, an enumerated type (also called enumeration or enum, or factor in the R programming language, and a categorical variable in statistics) is a data type consisting of a set of named values called elements, members or enumerators of the type.
> https://en.wikipedia.org/wiki/Enumerated_type

> You should always use enums when a variable (especially a method parameter) can only take one out of a small set of possible values. Examples would be things like type constants (contract status: "permanent", "temp", "apprentice"), or flags ("execute now", "defer execution").
> http://stackoverflow.com/a/4709224/194105

You end up with `values` which are smaller, so less goes into your database, and
less "over the wire", from server to client and back.

The translation from `values` to `labels` is all in very small application code,
cached on the client.

## Install

```
npm install --save s-enum
```

## Terms

* `key` should be a **camelCase** string selector for any node.
 * if you provide one, we don't do anything to it
 * if you do not provide one, we attempt to translate `label` to camelCase
* `value` can be **anything**... usually a number or string or function
 * if you don't provide one, we attempt to create a numerical value incrementing
   from `0`
* `label` should be a **human readable string**
 * if you don't provide one, we use key


## Usage Example: Days of the Week (basics)

First you create your enum object... this can happen anywhere

``` js
var Days = SEnum([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]);

// now you can access:
Days.values() === [0, 1, 2, 3, 4, 5, 6];
Days.keys() === ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
Days.labels() === ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
Days.options() === {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"};

// and via aliases on the value
Days.0.label === "Sunday";
Days.0.key === "sunday";
Days.0.value === 0;

// and via aliases on the key
Days.sunday.label === "Sunday"
Days.sunday.key === "sunday"
Days.sunday.value === 0;

// and use a get() to return any specific field, from value or key
Days.get("sunday", "value") === 0;
Days.get(0, "label") === "Sunday";
Days.get("not-found", "value", "defaultValue") === "defaultValue";
```

## Usage Example: Status

First you create your enum object... this can happen anywhere, but in this
example we are going to think about attaching this to an Object
(a data model / Collection object).

``` js
Tasks.Statuses = SEnum([
  { key: "submitted", value: 1,  label: "Submitted",
    icon: "fa fa-check" },
  { key: "accepted",  value: 2,  label: "Accepted",
    icon: "fa fa-check-circle" },
  { key: "completed", value: 31, label: "All Done Yo",
    icon: "fa fa-check-square", finished:  true }
]);

// NOTE in additiion to the basics above, you can get to any field configured

Tasks.Statuses.get("submitted", "icon") === "fa fa-check";
Tasks.Statuses.get(1, "icon") === "fa fa-check";
Tasks.Statuses.get(31, "finished") === true;
Tasks.Statuses.get(1, "finished") === undefined;
Tasks.Statuses.get(1, "finished", "defaultValue") === "defaultValue";

// and via aliases on the value
Tasks.Statuses.1.icon === "fa fa-check";
Tasks.Statuses.submitted.icon === "fa fa-check";
```

#### Integrating into Meteor (optional)

When this was originally written, it was for a [MeteorJS](https://meteor.com) application.
The following logic is how you can automatically translate/transform inputs
into SEnum values before writing to the database.  You can also validate to
only allow these values.

If you want, you can setup a
[simple-schema](https://github.com/aldeed/meteor-simple-schema/)
to only allow values from the SEnum.

``` js
// allow all values
allowedValues: Tasks.Statuses.values(),
// or allow all values AND all keys [1, 2, 31, "submitted", "accepted", "completed"]
allowedValues: Tasks.Statuses.values().concat(Tasks.Statuses.keys()),
```

You can setup a transform, translating all `keys` & `labels` into `values`

If you want to, you can setup a
[Mongo.Collection transform](http://docs.meteor.com/#/full/mongo_collection)
This will allow a user to pass in any `value` or `key`, and verify that it's got
a valid, `value`; if not it changes to `0`.

``` js
Tasks = new Mongo.Collection('tasks', {
  transform:  function(doc) {
    if (_.has(doc, "status")) {
      doc.status = Tasks.Statuses.value(doc.status, 0);
    }
    return doc;
  }
});
```

If you're using autoform/schemas you can setup `autoValue` something like the
following.

This will allow a user to pass in any `value` or `key`, and verify that it's got
a valid, `value`; if not it unsets... (you could choose not to unset, and
instead get validation errors based on `allowedValues`).

``` js
status: {
  type: Number,
  optional: true,
  autoValue: function() {
    var autoFormField = this.field("status");
    if (!autoFormField.isSet) {
      this.unset();
      return;
    }
    var status = Tasks.Statuses.value(autoFormField.value);
    if (typeof status === "undefined") {
      this.unset();
      return;
    }
    return status;
  }
}
```

And for any template, you can easily translate
`value` -> `label`
or any `value` -> any other field...

This allows some fancy and simple comparable translations.

``` js
Template.Example.helpers({

  // value -> label
  status: function() {
    return Tasks.Statuses.label(this.status);
  },

  // value -> <i> font awesome icon (with default=?)
  statusIcon: function() {
    var icon = Tasks.Statuses.get(this.status, "icon");
    if (!icon) {
      icon = "fa fa-question";
    }
    return '<i class="' + icon '"></i>';
  },

  // value -> <span class="label {{finished?}}"><i> text
  statusLabelAndIcon: function() {
    var label = Tasks.Statuses.label(this.status, "Unknown");
    var icon = Tasks.Statuses.get(this.status, "icon");
    if (!icon) {
      icon = "fa fa-question";
    }
    var finished = Tasks.Statuses.get(this.status, "finished");
    var className = finished ? 'success' : 'default';
    return '<span class="label label-' + className + '">' +
      '<i class="' + icon '"></i> ' + label +
      '</span>';
  }
});
```

## TODO / Roadmap

- [x] Construct support for full nodes, simple `[value, ...]` lists, and `{value: lable, ...}` lists
- [x] Object helper methods: `keys(), values(), labels()`
- [x] Object helper methods: `get(), value(), label()`
- [x] Fully tested
- [x] README w/ real world usage examples
- [ ] Meteor ui helper (maybe as extra optional package) `{{SEnum status Tasks.Statuses}}`


