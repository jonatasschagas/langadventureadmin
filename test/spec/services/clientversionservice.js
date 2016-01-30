'use strict';

describe('Service: ClientVersionService', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var ClientVersionService;
  beforeEach(inject(function (_ClientVersionService_) {
    ClientVersionService = _ClientVersionService_;
  }));

  it('should do something', function () {
    expect(!!ClientVersionService).toBe(true);
  });

});
