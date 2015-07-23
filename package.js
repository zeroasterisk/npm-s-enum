/*
 * A super enum(ish) factory
 *
 * Useful for managing lists of configs/options
 *
 * Tasks.Statuses = SEnum([
 *   { key: "submitted", value: 1, label: "Submitted", icon: "fa fa-check" },
 *   { key: "accepted",  value: 2, label: "Accepted",  icon: "fa fa-check-circle" },
 *   { key: "completed", value:31, label: "Done",      icon: "fa fa-check-square" }
 * ]);
 *
 * // allow all values AND all keys
 * allowedValues: Tasks.Statuses.values().concat(Tasks.Statuses.keys())
 *   ^ [1, 2, 31, "submitted", "accepted", "completed"]
 *
 * // get all labels
 * Tasks.Statuses.labels();
 *   ^ ["Submitted", "Accepted", "Completed"]
 *
 * See the README.md for more
 * See the super_enum_test.js for details
 *
 * @package zeroasterisk:s-enum Super Enum
 * @author zeroasterisk <alan@zeroasterisk.com>
 * @license MIT
 */
Package.describe({
  name: "zeroasterisk:s-enum",
  summary: "Super Enum Factory",
  version: "1.0.0",
  git: "https://github.com/zeroasterisk/meteor-super-enums"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use(['meteor', 'underscore'], ['client', 'server']);
  api.export('SEnum', ['client', 'server']);
  api.addFiles('super_enum.js', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use("zeroasterisk:s-enum");
  api.use('tinytest@1.0.0');
  api.addFiles('super_enum_test.js', ['client', 'server']);
});
