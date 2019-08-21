import { GoogleMaterialDesignModule } from './google-material-design.module';

describe('GoogleMaterialDesignModule', () => {
  let googleMaterialDesignModule: GoogleMaterialDesignModule;

  beforeEach(() => {
    googleMaterialDesignModule = new GoogleMaterialDesignModule();
  });

  it('should create an instance', () => {
    expect(googleMaterialDesignModule).toBeTruthy();
  });
});
