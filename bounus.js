/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
function rotate(nums, k) {
  let n = nums.length;
  k %= n; 

  
  function reverse(start, end) {
      while (start < end) {
          [nums[start], nums[end]] = [nums[end], nums[start]];
          start++;
          end--;
      }
  }

  
  reverse(0, n - 1);
  
  reverse(0, k - 1);
  
  reverse(k, n - 1);
}


let nums1 = [1,2,3,4,5,6,7];
rotate(nums1, 3);
console.log(nums1); 

let nums2 = [-1,-100,3,99];
rotate(nums2, 2);
console.log(nums2); 
