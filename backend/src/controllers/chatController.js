const User = require('../models/userModel');

// Main function to handle user inquiries
exports.getChatResponse = async (req, res) => {
  const { carType, queryType } = req.body; // Frontend will pass carType and queryType (TPU/PVC understanding)

  // Validate incoming data
  if (!carType || !queryType) {
    return res.status(400).json({ message: 'Car type and query type are required' });
  }

  try {
    // Decision engine logic
    let responseMessage = decisionEngine(carType, queryType);

    // Store user interaction in the database
    const userInteraction = new User({
      carType,
      query: queryType,
      response: responseMessage
    });

    await userInteraction.save();

    // Send the response back to the frontend
    res.status(200).json({ message: responseMessage });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Decision engine function
function decisionEngine(carType, queryType) {
  let responseMessage = '';

  if (carType === 'new' && queryType === 'both') {
    responseMessage = 'New car, and you understand both TPU and PVC: Great! We recommend you consider the latest TPU wraps for better durability.';
  } else if (carType === 'old' && queryType === 'TPU') {
    responseMessage = 'Old car with TPU knowledge: TPU is the best for protecting an older car from wear and tear!';
  } else if (queryType === 'PVC') {
    responseMessage = 'PVC wraps are generally more affordable, but TPU offers better protection for both new and old cars.';
  } else {
    responseMessage = 'It seems you are unfamiliar with both TPU and PVC. Let me explain the differences...';
  }

  return responseMessage;
}
