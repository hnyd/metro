/**
 * Created by Captain on 2018/3/14 15:23.
 */

let linkStructL;

function setList(ll) {
  linkStructL = ll;
}

function getList() {
  return linkStructL;
}

const link = {
  setList: setList,
  getList: getList
};

module.exports = link;
