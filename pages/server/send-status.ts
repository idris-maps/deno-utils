export const sendStatus = (status: number) => {
  if (status === 404) {
    return new Response('{"message":"page does not exist"}', {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response('{"message":"internal server error"}', {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
};
