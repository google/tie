// Copyright 2017 The TIE Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for ReinforcementBulletObjectFactory domain objects.
 */

describe('ReinforcementBulletObjectFactory', function() {
  var ReinforcementBulletObjectFactory;

  beforeEach(module('tie'));
  beforeEach(inject(function($injector) {
    ReinforcementBulletObjectFactory = $injector.get(
      'ReinforcementBulletObjectFactory');
  }));

  describe('createPassedBullet', function() {
    it('should correctly create a passed bullet', function() {
      var passedBullet;
      passedBullet = ReinforcementBulletObjectFactory.createPassedBullet(
        'passed_bullet_content');
      expect(passedBullet.isPassedBullet()).toEqual(true);
      expect(passedBullet.getContent()).toEqual('passed_bullet_content');
    });
  });

  describe('createFailedBullet', function() {
    it('should correctly create a failed bullet', function() {
      var failedBullet;
      failedBullet = ReinforcementBulletObjectFactory.createFailedBullet(
        'failed_bullet_content');
      expect(failedBullet.isPassedBullet()).toEqual(false);
      expect(failedBullet.getContent()).toEqual('failed_bullet_content');
    });
  });

  describe('getImgName', function() {
    it('should correctly get image name', function() {
      var passedBullet;
      passedBullet = ReinforcementBulletObjectFactory.createPassedBullet(
        'passed_bullet_content');
      expect(passedBullet.getImgName()).toEqual('pass.png');

      var failedBullet;
      failedBullet = ReinforcementBulletObjectFactory.createFailedBullet(
        'failed_bullet_content');
      expect(failedBullet.getImgName()).toEqual('fail.png');
    });
  });

  describe('createBulletFromDict', function() {
    it('should correctly return bullets from a dict version', function() {
      var dictBullet = {
        _passed: true,
        _content: 'this is some good content'
      };
      var passedBullet;
      passedBullet = ReinforcementBulletObjectFactory.createPassedBullet(
        'this is some good content');
      expect(ReinforcementBulletObjectFactory.fromDict(dictBullet))
        .toEqual(passedBullet);
    });
  });
});
