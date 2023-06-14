export function MStoTime(ms: number, long = false) {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const daysms = ms % (24 * 60 * 60 * 1000);
  const hours = Math.floor(daysms / (60 * 60 * 1000));
  const hoursms = ms % (60 * 60 * 1000);
  const minutes = Math.floor(hoursms / (60 * 1000));
  const minutesms = ms % (60 * 1000);
  const sec = Math.floor(minutesms / 1000);

  let output = "";

  if (days > 0) {
    output = output + days;
    if (long) {
      output += ` day${days == 1 ? "" : "s"} `;
    } else {
      output += "d ";
    }
  }

  if (hours > 0) {
    output = output + hours;
    if (long) {
      output += ` hour${hours == 1 ? "" : "s"} `;
    } else {
      output += "h ";
    }
  }

  if (minutes > 0) {
    output = output + minutes;
    if (long) {
      output += ` minute${minutes == 1 ? "" : "s"} `;
    } else {
      output += "m ";
    }
  }

  if (sec > 0) {
    output = output + sec;
    if (long) {
      output += ` second${sec == 1 ? "" : "s"} `;
    } else {
      output += "s ";
    }
  }

  return output.trim();
}
