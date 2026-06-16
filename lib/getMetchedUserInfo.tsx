const getMatchedUserInfo = (users: any, userLoggedIn: string) => {
  const newUsers = { ...users };
  delete newUsers[userLoggedIn];
  const [id, user] = Object.entries(newUsers)[0];
  // console.log("Matched user info extracted:", { id, ...user }); // Debug log
  return { id, ...(user as any) };
};

export default getMatchedUserInfo;
