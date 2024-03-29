module.exports = () => {
  return async (ctx, next) => {
    const authorization = ctx.get('Authorization') || ctx.get('authorization') || ctx.cookies.get('authorization');
    if (!authorization) {
      ctx.body = {
        code: 50001,
        data: '',
        msg: 'token 缺失',
      };
    } else {
      const token = authorization.split(' ')[1];
      const data = ctx.service.user.verify(token);
      // console.log('TOKEN:', data);
      if (data.status === 1) {
        // console.log(data.data);
        ctx.state.user = data.data;
        await next();
      } else {
        ctx.body = {
          code: 50001,
          data: data.status,
          msg: data.data,
        };
      }
    }
  };
};
