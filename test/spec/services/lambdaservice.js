'use strict';

describe('Service: lambdaService', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var lambdaService;
  beforeEach(inject(function (_lambdaService_) {
    lambdaService = _lambdaService_;
  }));

  it('should do something', function () {
    expect(!!lambdaService).toBe(true);
  });

});
