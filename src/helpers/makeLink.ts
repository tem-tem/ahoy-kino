export default (str: string) => {
  const regex = /[- !$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/gi
  return str.replace(regex, '_')
}
