
export default function calculateExpireDate(currentExpireDate, month)
{
  // we will assume that currentExpireDate will be always at the end of the month
  return new Date(currentExpireDate.getFullYear(), currentExpireDate.getMonth()  + month, 0);

}