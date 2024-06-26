const formatTime = (time: Date) => {
    return new Date(time)
    .toLocaleString('vi', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'Asia/Ho_Chi_Minh',
    })
    .split(' ')
    .reverse()
    .join(' ');
};

export default formatTime;
