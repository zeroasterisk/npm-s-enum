/**
 *
 * @package super-enum
 * @author zeroasterisk <alan@zeroasterisk.com>
 * @license MIT
 */

//jest.unmock('../dist/s_enum.cjs.js');
jest.unmock('../s_enum.js');

import _ from 'underscore';
import SEnum from '../s_enum';

describe('SEnum Test', function() {

  let Statuses, Days, DaysAbbr;
  beforeEach(function() {
    // create SEnum for Statuses
    //   these are the 'full nodes' which are 'correct'
    //   pass in [{key: xxx, value: xxx, label: xxx, ...}, ...]
    Statuses = SEnum([
      { key: 'submitted', value: 1,  label: 'Submitted',
        icon: 'fa fa-check' },
      { key: 'accepted',  value: 2,  label: 'Accepted',
        icon: 'fa fa-check-circle' },
      { key: 'completed', value: 31, label: 'All Done Yo',
        icon: 'fa fa-check-square', finished:  true }
    ]);

    // create days of the week
    //   but we are going to pass in [label, ...]
    //   this basically runs as a standard enum, auto-assigning values 0, 1, 2, 3...
    //   this should parse into 'full nodes' (as above)
    Days = SEnum([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]);
    // create days of the week
    //   but we are going to pass in {value: label, ...}
    //   this should parse into 'full nodes' (as above)
    DaysAbbr = SEnum({
      'su': 'Sunday',
      'mo': 'Monday',
      'tu': 'Tuesday',
      'we': 'Wednesday',
      'tr': 'Thursday',
      'fi': 'Friday',
      'sa': 'Saturday'
    });
  });

  describe('keys', function() {
    it('should give back status keys', function() {
      expect(Statuses.keys()).toEqual(
        ['submitted', 'accepted', 'completed']
      );
    });
    it('should give back days keys', function() {
      expect(Days.keys()).toEqual(
        [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday'
        ]
      );
    });
    it('should give back days abbr keys', function() {
      expect(DaysAbbr.keys()).toEqual(
        [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday'
        ]
      );
    });
  });

  describe('values', function() {
    it('should give back status values', function() {
      expect(Statuses.values()).toEqual(
        [1, 2, 31]
      );
    });
    it('should give back days values', function() {
      expect(Days.values()).toEqual(
        [0, 1, 2, 3, 4, 5, 6]
      );
    });
    it('should give back days values', function() {
      expect(DaysAbbr.values()).toEqual(
        ['su', 'mo', 'tu', 'we', 'tr', 'fi', 'sa']
      );
    });
  });

  describe('labels', function() {
    it('should give back status labels', function() {
      expect(Statuses.labels()).toEqual(
        ['Submitted', 'Accepted', 'All Done Yo']
      );
    });
    it('should give back Days labels', function() {
      expect(Days.labels()).toEqual(
        [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ]
      );
    });
    it('should give back DaysAbbr labels', function() {
      expect(DaysAbbr.labels()).toEqual(
        [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ]
      );
    });
  });

  describe('options', function() {
    it('should give back status options', function() {
      expect(Statuses.options()).toEqual(
        {1: 'Submitted', 2: 'Accepted', 31: 'All Done Yo'}
      );
    });
  });

  describe('get', function() {
    describe('Statuses', function() {
      it('should get label value=1', function() {
        expect(Statuses.get(1, 'label')).toEqual('Submitted');
      });
      it('should get label key=submitted', function() {
        expect(Statuses.get('submitted', 'label')).toEqual('Submitted');
      });
      it('should get label value=2', function() {
        expect(Statuses.get(2, 'label')).toEqual('Accepted');
      });
      it('should get label key=accepted', function() {
        expect(Statuses.get('accepted', 'label')).toEqual('Accepted');
      });
      it('should get label value=31', function() {
        expect(Statuses.get(31, 'label')).toEqual('All Done Yo');
      });
      it('should get label key=completed', function() {
        expect(Statuses.get('completed', 'label')).toEqual('All Done Yo');
      });
      it('should get undefined for a bad key (not a value, nor key)', function() {
        expect(Statuses.get('badKey', 'label')).toEqual(undefined);
      });
      it('should get icon (extra field) value=31', function() {
        expect(Statuses.get(31, 'icon')).toEqual('fa fa-check-square');
      });
      it('should get icon (extra field) key=completed', function() {
        expect(Statuses.get('completed', 'icon')).toEqual('fa fa-check-square');
      });
      it('should get finished=true (extra field) key=completed', function() {
        expect(Statuses.get('completed', 'finished')).toEqual(true);
      });
      it('should get finished=undefined (extra field) key=accepted', function() {
        expect(Statuses.get('accepted', 'finished')).toEqual(undefined);
      });

      it('should get full node for key=completed', function() {
        expect(Statuses.get('completed')).toEqual({
          key: 'completed',
          value: 31,
          label: 'All Done Yo',
          icon: 'fa fa-check-square',
          finished: true
        });
      });
    });

    describe('Days', function() {
      it('should get label label=Monday', function() {
        expect(Days.get('Monday', 'label')).toEqual('Monday');
      });
      it('should get label key=monday', function() {
        expect(Days.get('monday', 'label')).toEqual('Monday');
      });
      it('should get label val=1', function() {
        expect(Days.get(1, 'label')).toEqual('Monday');
      });
    });
    describe('DaysAbbr', function() {
      it('should get label label=Monday', function() {
        expect(DaysAbbr.get('Monday', 'label')).toEqual('Monday');
      });
      it('should get label key=monday', function() {
        expect(DaysAbbr.get('monday', 'label')).toEqual('Monday');
      });
      it('should get label val=mo', function() {
        expect(DaysAbbr.get('mo', 'label')).toEqual('Monday');
      });
    });
  });


  describe('value', function() {
    describe('Statuses', function() {
      it('should get value value=1', function() {
        expect(Statuses.value(1)).toEqual(1);
      });
      it('should get value key=submitted', function() {
        expect(Statuses.value('submitted')).toEqual(1);
      });
      it('should get value value=2', function() {
        expect(Statuses.value(2)).toEqual(2);
      });
      it('should get value key=accepted', function() {
        expect(Statuses.value('accepted')).toEqual(2);
      });
      it('should get undefined key=badKey', function() {
        expect(Statuses.value('badKey')).toEqual(undefined);
      });
      it('should get undefined value=9', function() {
        expect(Statuses.value(9)).toEqual(undefined);
        expect(Statuses.value('9')).toEqual(undefined);
      });
      it('should get default for key=badKey with defaultValue=0', function() {
        expect(Statuses.value('badKey', 0)).toEqual(0);
      });
      it('should get default for key=badKey with defaultValue=My Default', function() {
        expect(Statuses.value('badKey', 'My Default')).toEqual('My Default');
      });
    });
  });

  describe('alias', function() {
    describe('by value or key', function() {
      it('works via numerical index', function() {
        expect(Days[1].label).toEqual('Monday');
        expect(DaysAbbr.mo.label).toEqual('Monday');
      });
      it('works via key as object property key', function() {
        expect(Days.monday.label).toEqual('Monday');
        expect(DaysAbbr.monday.label).toEqual('Monday');
      });
      it('works for extra fields too', function() {
        expect(Statuses.completed.finished).toEqual(true);
      });
      it('gets undefined for extra fields which do not exist', function() {
        expect(Statuses.accepted.finished).toEqual(undefined);
      });

      // GOTCHA - this can't be found, because it's a bad key
      // expect(Statuses.badKey.finished).toEqual(undefined);
      // instead we error?
    });
  });

  /* Meteor testing via Tinytest --- commented out for now
  Tinytest.add('SEnum - Collection Transform', function(test) {

    var Tasks = new Mongo.Collection(null, {
      transform:  function(doc) {
        if (_.has(doc, 'status')) {
          doc.status = Tasks.Statuses.value(doc.status, 0);
        }
        return doc;
      }
    });
    Tasks.Statuses = Statuses;

    // no auto-value
    Tasks.insert({
      _id: 'test0'
    });
    test.equal(
      Tasks.findOne('test0').status,
      undefined,
      'transform should not auto-assign any value'
    );

    // auto translate from key
    Tasks.insert({
      _id: 'test1',
      status: 'completed'
    });
    test.equal(
      Tasks.findOne('test1').status,
      31,
      'transform should translate from completed to 31'
    );

    // auto translate from value to self
    Tasks.insert({
      _id: 'test2',
      status: 31
    });
    test.equal(
      Tasks.findOne('test2').status,
      31,
      'transform should translate from 31 to 31'
    );

    // auto translate from value to self
    Tasks.insert({
      _id: 'test3',
      status: '31'
    });
    test.equal(
      Tasks.findOne('test3').status,
      31,
      'transform should translate from '31' to 31'
    );

    // auto translate from bad value to default of 0
    Tasks.insert({
      _id: 'test4',
      status: 99
    });
    test.equal(
      Tasks.findOne('test4').status,
      0,
      'transform should translate from a bad value, into the default of 0'
    );

  });
  */

});



