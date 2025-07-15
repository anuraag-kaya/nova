// In your FeedbackWidget component, replace the handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!rating) return;

  setIsSubmitting(true);

  try {
    // Directly call your FastAPI backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback_type: rating, // 'good' or 'bad'
        feedback: feedback.trim() || null,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    const data = await response.json();
    console.log('Feedback submitted successfully:', data);

    setShowSuccess(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setIsOpen(false);
      setFeedback("");
      setRating(null);
      setShowSuccess(false);
    }, 2000);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    // You might want to show an error message to the user here
  } finally {
    setIsSubmitting(false);
  }
};