// CI/CD TESTING BELOW
const ReelController = require('./ReelController');
describe('ReelController - createReel', () => {

  test('SHOULD RETURN 404 IF VIDEO URL IS MISSING', async () => {
    const req = {
      body: { caption: "MONSTER GIRLS" },
      file: null 
    };
    
    const res = {
      status: jest.fn().mockReturnThis(), 
      json: jest.fn() 
    };

    await ReelController.createReel(req, res);

    expect(res.status).toHaveBeenCalledWith(404); 
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "NEED TO PUT IN A VIDEO" }) 
    );
  });
});