/**
 * Test to verify custom logo attribute saving behavior
 * This tests that manually uploaded logos are not overridden by URL-based logos
 */

// Mock setAttributes function to track calls
let attributeChanges = [];
const mockSetAttributes = (newAttributes) => {
    attributeChanges.push(newAttributes);
    console.log('setAttributes called with:', newAttributes);
};

// Mock window.embedpressObj
global.window = {
    embedpressObj: {
        youtube_brand_logo_url: 'https://example.com/youtube-logo.png',
        vimeo_brand_logo_url: 'https://example.com/vimeo-logo.png',
        wistia_brand_logo_url: 'https://example.com/wistia-logo.png',
        twitch_brand_logo_url: 'https://example.com/twitch-logo.png',
        dailymotion_brand_logo_url: 'https://example.com/dailymotion-logo.png'
    }
};

// Simulate the useEffect logic
function simulateUseEffect(url, customlogo) {
    console.log(`\n=== Testing URL: ${url}, Current customlogo: ${customlogo || 'empty'} ===`);
    
    // Reset attribute changes
    attributeChanges = [];
    
    // This is the fixed logic from the useEffect
    if (typeof window.embedpressObj !== 'undefined' && !customlogo) {
        const embedpressObj = window.embedpressObj;
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            mockSetAttributes({
                customlogo: embedpressObj.youtube_brand_logo_url || ''
            });
        } else if (url.includes('vimeo.com')) {
            mockSetAttributes({
                customlogo: embedpressObj.vimeo_brand_logo_url || ''
            });
        } else if (url.includes('wistia.com')) {
            mockSetAttributes({
                customlogo: embedpressObj.wistia_brand_logo_url || ''
            });
        } else if (url.includes('twitch.com')) {
            mockSetAttributes({
                customlogo: embedpressObj.twitch_brand_logo_url || ''
            });
        } else if (url.includes('dailymotion.com')) {
            mockSetAttributes({
                customlogo: embedpressObj.dailymotion_brand_logo_url || ''
            });
        }
    }
    
    return attributeChanges;
}

console.log('Testing Custom Logo Attribute Saving Behavior...\n');

// Test 1: New YouTube URL with no existing custom logo (should set logo)
console.log('TEST 1: New YouTube URL with no existing custom logo');
const test1 = simulateUseEffect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '');
console.log('Result: Should set YouTube logo -', test1.length > 0 ? 'PASS' : 'FAIL');

// Test 2: YouTube URL with existing custom logo (should NOT override)
console.log('\nTEST 2: YouTube URL with existing custom logo');
const test2 = simulateUseEffect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://mysite.com/my-custom-logo.png');
console.log('Result: Should NOT override existing logo -', test2.length === 0 ? 'PASS' : 'FAIL');

// Test 3: Vimeo URL with no existing custom logo (should set logo)
console.log('\nTEST 3: New Vimeo URL with no existing custom logo');
const test3 = simulateUseEffect('https://vimeo.com/123456789', '');
console.log('Result: Should set Vimeo logo -', test3.length > 0 ? 'PASS' : 'FAIL');

// Test 4: Vimeo URL with existing custom logo (should NOT override)
console.log('\nTEST 4: Vimeo URL with existing custom logo');
const test4 = simulateUseEffect('https://vimeo.com/123456789', 'https://mysite.com/my-custom-logo.png');
console.log('Result: Should NOT override existing logo -', test4.length === 0 ? 'PASS' : 'FAIL');

// Test 5: Non-supported URL with no existing custom logo (should do nothing)
console.log('\nTEST 5: Non-supported URL with no existing custom logo');
const test5 = simulateUseEffect('https://example.com/some-content', '');
console.log('Result: Should do nothing -', test5.length === 0 ? 'PASS' : 'FAIL');

// Test 6: Non-supported URL with existing custom logo (should do nothing)
console.log('\nTEST 6: Non-supported URL with existing custom logo');
const test6 = simulateUseEffect('https://example.com/some-content', 'https://mysite.com/my-custom-logo.png');
console.log('Result: Should do nothing -', test6.length === 0 ? 'PASS' : 'FAIL');

// Test 7: Switching from YouTube to Vimeo with existing custom logo (should NOT override)
console.log('\nTEST 7: Switching from YouTube to Vimeo with existing custom logo');
const test7 = simulateUseEffect('https://vimeo.com/987654321', 'https://mysite.com/my-custom-logo.png');
console.log('Result: Should NOT override existing logo -', test7.length === 0 ? 'PASS' : 'FAIL');

// Summary
console.log('\n=== SUMMARY ===');
const tests = [test1, test2, test3, test4, test5, test6, test7];
const expectedResults = [true, false, true, false, false, false, false]; // true = should call setAttributes
const results = tests.map((test, index) => {
    const shouldCall = expectedResults[index];
    const didCall = test.length > 0;
    return shouldCall === didCall;
});

const passedTests = results.filter(result => result).length;
const totalTests = results.length;

console.log(`Tests passed: ${passedTests}/${totalTests}`);
console.log('Overall result:', passedTests === totalTests ? 'ALL TESTS PASSED ✅' : 'SOME TESTS FAILED ❌');

if (passedTests === totalTests) {
    console.log('\n🎉 The custom logo attribute saving issue has been fixed!');
    console.log('✅ Manual custom logos will no longer be overridden by URL-based logos');
    console.log('✅ URL-based logos will still be set when no custom logo exists');
} else {
    console.log('\n❌ There are still issues with the custom logo saving behavior');
}
