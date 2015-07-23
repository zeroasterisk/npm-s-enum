/**
 *
 * @package zeroasterisk:s-enum Super Enum
 * @author zeroasterisk <alan@zeroasterisk.com>
 * @license MIT
 */

// create SEnum for Statuses
//   these are the "full nodes" which are "correct"
//   pass in [{key: xxx, value: xxx, label: xxx, ...}, ...]
var Statuses = SEnum([
  { key: "submitted", value: 1,  label: "Submitted",
    icon: "fa fa-check" },
  { key: "accepted",  value: 2,  label: "Accepted",
    icon: "fa fa-check-circle" },
  { key: "completed", value: 31, label: "All Done Yo",
    icon: "fa fa-check-square", finished:  true }
]);

// create days of the week
//   but we are going to pass in [label, ...]
//   this basically runs as a standard enum, auto-assigning values 0, 1, 2, 3...
//   this should parse into "full nodes" (as above)
var Days = SEnum([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]);

// create days of the week
//   but we are going to pass in {value: label, ...}
//   this should parse into "full nodes" (as above)
var DaysAbbr = SEnum({
  "su": "Sunday",
  "mo": "Monday",
  "tu": "Tuesday",
  "we": "Wednesday",
  "tr": "Thursday",
  "fi": "Friday",
  "sa": "Saturday"
});


Tinytest.add("SEnum - keys", function(test) {
  test.equal(
    Statuses.keys(),
    ["submitted", "accepted", "completed"],
    "Statuses.keys()"
  );
  test.equal(
    Days.keys(),
    [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ],
    "Days.keys()"
  );
  test.equal(
    DaysAbbr.keys(),
    [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ],
    "DaysAbbr.keys()"
  );
});

Tinytest.add("SEnum - values", function(test) {
  test.equal(
    Statuses.values(),
    [1, 2, 31],
    "Statuses.values()"
  );
  test.equal(
    Days.values(),
    [0, 1, 2, 3, 4, 5, 6],
    "Days.values()"
  );
  test.equal(
    DaysAbbr.values(),
    ["su", "mo", "tu", "we", "tr", "fi", "sa"],
    "DaysAbbr.values()"
  );
});

Tinytest.add("SEnum - labels", function(test) {
  test.equal(
    Statuses.labels(),
    ["Submitted", "Accepted", "All Done Yo"],
    "Statuses.labels()"
  );
  test.equal(
    Days.labels(),
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "Days.labels()"
  );
  test.equal(
    DaysAbbr.labels(),
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "DaysAbbr.labels()"
  );
});

Tinytest.add("SEnum - get", function(test) {
  // get label by value and key
  test.equal(
    Statuses.get(1, "label"),
    "Submitted",
    "Statuses: get label for value=1"
  );
  test.equal(
    Statuses.get("submitted", "label"),
    "Submitted",
    "Statuses: get label for key=submitted"
  );
  test.equal(
    Statuses.get(2, "label"),
    "Accepted",
    "Statuses: get label for value=2"
  );
  test.equal(
    Statuses.get("accepted", "label"),
    "Accepted",
    "Statuses: get label for key=accepted"
  );
  test.equal(
    Statuses.get(31, "label"),
    "All Done Yo",
    "Statuses: get label for value=31"
  );
  test.equal(
    Statuses.get("completed", "label"),
    "All Done Yo",
    "Statuses: get label for key=completed"
  );

  // get label for a bad key (not a value, nor key)
  test.equal(
    Statuses.get("badKey", "label"),
    undefined,
    "Statuses: get label for key=badKey (should be undefined)"
  );

  // get "extra" field: icon
  test.equal(
    Statuses.get(31, "icon"),
    "fa fa-check-square",
    "Statuses: get icon for value=31"
  );
  test.equal(
    Statuses.get("completed", "icon"),
    "fa fa-check-square",
    "Statuses: get icon for key=completed"
  );

  // get full node
  test.equal(
    Statuses.get("completed"),
    { key: "completed", value: 31, label: "All Done Yo",
      icon: "fa fa-check-square", finished: true },
    "Statuses: get full node for key=completed"
  );

  // get "extra" field: finished (only on completed)
  test.equal(
    Statuses.get("completed", "finished"),
    true,
    "Statuses: get finished for key=completed"
  );
  test.equal(
    Statuses.get("accepted", "finished"),
    undefined,
    "Statuses: get finished for key=accepted"
  );
  test.equal(
    Statuses.get("badKey", "finished"),
    undefined,
    "Statuses: get finished for key=badKey"
  );

  // Days
  test.equal(
    Days.get("Monday", "label"),
    "Monday",
    "Days: get label for label=Monday"
  );
  test.equal(
    Days.get("monday", "label"),
    "Monday",
    "Days: get label for key=monday"
  );
  test.equal(
    Days.get(1, "label"),
    "Monday",
    "Days: get label for value=1"
  );

  // DaysAbbr
  test.equal(
    DaysAbbr.get("Monday", "label"),
    "Monday",
    "DaysAbbr: get label for label=Monday"
  );
  test.equal(
    DaysAbbr.get("monday", "label"),
    "Monday",
    "DaysAbbr: get label for key=monday"
  );
  test.equal(
    DaysAbbr.get('mo', "label"),
    "Monday",
    "DaysAbbr: get label for value=mo"
  );
});

Tinytest.add("SEnum - value", function(test) {
  // get value by value and key
  test.equal(
    Statuses.value(1),
    1,
    "Statuses: value for value=1"
  );
  test.equal(
    Statuses.value("submitted"),
    1,
    "Statuses: value for key=submitted"
  );
  test.equal(
    Statuses.value(2),
    2,
    "Statuses: value for value=2"
  );
  test.equal(
    Statuses.value("accepted"),
    2,
    "Statuses: value for key=accepted"
  );
  test.equal(
    Statuses.value(31),
    31,
    "Statuses: value for value=31"
  );
  test.equal(
    Statuses.value("completed"),
    31,
    "Statuses: value for key=completed"
  );

  // get label for a bad key (not a value, nor key)
  test.equal(
    Statuses.value("badKey"),
    undefined,
    "Statuses: value for key=badKey (should be undefined)"
  );
0
  // get label for a bad key (not a value, nor key) with default
  test.equal(
    Statuses.value("badKey", 0),
    0,
    "Statuses: value for key=badKey (w/ Default 0)"
  );
  test.equal(
    Statuses.value("badKey", "My Default"),
    "My Default",
    "Statuses: value for key=badKey (w/ Default string)"
  );

  // bad value = 9, not in there as a key or value
  test.equal(
    Statuses.value(9),
    undefined,
    "Statuses: value for value=9 (should be undefined)"
  );

});

Tinytest.add("SEnum - alias by value or key", function(test) {
  test.equal(
    Days[1].label,
    "Monday",
    "Days.1.label"
  );
  test.equal(
    Days.monday.label,
    "Monday",
    "Days.monday.label"
  );
  test.equal(
    DaysAbbr.mo.label,
    "Monday",
    "DaysAbbr.mo.label"
  );
  test.equal(
    DaysAbbr.monday.label,
    "Monday",
    "DaysAbbr.mo.label"
  );

  test.equal(
    Statuses.completed.label,
    "All Done Yo",
    "Statuses.completed.label"
  );
  test.equal(
    Statuses.completed.finished,
    true,
    "Statuses.completed.finished"
  );
  test.equal(
    Statuses.accepted.finished,
    undefined,
    "Statuses.accepted.finished (not set, should be undefined)"
  );
  /*
  GOTCHA - this can't be found, because it's a bad key
  test.equal(
    Statuses.badKey.finished,
    null,
    "Statuses.badKey.finished (not set, should be null)"
  );
  */
});

Tinytest.add("SEnum - Collection Transform", function(test) {

  var Tasks = new Mongo.Collection(null, {
    transform:  function(doc) {
      if (_.has(doc, "status")) {
        doc.status = Tasks.Statuses.value(doc.status, 0);
      }
      return doc;
    }
  });
  Tasks.Statuses = Statuses;

  // no auto-value
  Tasks.insert({
    _id: "test0"
  });
  test.equal(
    Tasks.findOne("test0").status,
    undefined,
    'transform should not auto-assign any value'
  );

  // auto translate from key
  Tasks.insert({
    _id: "test1",
    status: "completed"
  });
  test.equal(
    Tasks.findOne("test1").status,
    31,
    'transform should translate from completed to 31'
  );

  // auto translate from value to self
  Tasks.insert({
    _id: "test2",
    status: 31
  });
  test.equal(
    Tasks.findOne("test2").status,
    31,
    'transform should translate from 31 to 31'
  );

  // auto translate from value to self
  Tasks.insert({
    _id: "test3",
    status: "31"
  });
  test.equal(
    Tasks.findOne("test3").status,
    31,
    'transform should translate from "31" to 31'
  );

  // auto translate from bad value to default of 0
  Tasks.insert({
    _id: "test4",
    status: 99
  });
  test.equal(
    Tasks.findOne("test4").status,
    0,
    'transform should translate from a bad value, into the default of 0'
  );

});


