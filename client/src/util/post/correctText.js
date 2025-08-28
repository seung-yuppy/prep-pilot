export const correctText = async (pureText) => {
  try {
    const response = await fetch('https://prep-pilot.onrender.com/correct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: pureText }),
    });
    console.log(response);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Error from AI review API');
    }
  } catch (error) {
    throw new Error(error.message || 'Error during AI review');
  }
};