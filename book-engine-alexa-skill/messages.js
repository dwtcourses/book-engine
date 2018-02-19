

module.exports = {
  cardGreeting: () => 'Welcome to BFI Book Engine',
  messageGreeting: () => 'Welcome to BFI Book Engine. This skill fetches details for kids books. You can ask for a book by title or author like \'Tell me about Harry Potter from J.K. Rowlings\'',
  repromptGreeting: () => 'I\'m sorry, I am not able to hear your request. Please repeat or say \'help\' for sample requests',
  cardHelp: () => 'Help from BFI Book Engine',
  messageHelp: () => 'You can ask this skills, \'most popular business books of all time\', \'most read young adult books for this week\' or book by title or author',
  cardInvalidRequest: () => 'BFI Book Engine, unable to process request',
  messageInvalidRequest: () => 'I\'m sorry. I was not able to retrieve book title or author from your request. A sample request can be \'Tell me about Harry Potter from J.K. Rowlings\'',
  cardIneligibleRequest: () => 'BFI Book Engine, non-children book requested',
  messageIneligibleRequest: book => `${book} is not a children book according to our data records.`,
  cardGoodBye: () => 'Good Bye from BFI Book Engine',
  messageGoodBye: () => 'Thank you for using BFI Book Engine',
  messageReprompt: () => 'I\'m sorry, I am not able to hear your request. Please repeat or say \'help\' for sample requests',
};
