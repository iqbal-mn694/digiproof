exports.login = (req, res) => {
  const { email, password } = req.body;
  
  res.send('login post')
}

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  
  res.send('register post')
}