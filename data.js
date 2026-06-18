/**
 * data.js – বিদ্যুত বিলের ডেটা সংরক্ষণ ও পরিচালনা
 */

(function() {
    'use strict';

    // ---------- ডেটা স্টোর ----------
    let billData = [];

    // ---------- ডেমো ডেটা ----------
    const demoData = [
        { meter: 'MET-2025-101', name: 'রহিম মিয়া', phone: '01712345678' },
        { meter: 'MET-2025-102', name: 'করিম উদ্দিন', phone: '01988765432' },
        { meter: 'MET-2025-103', name: 'সুমাইয়া আক্তার', phone: '01677890123' }
    ];

    // ---------- localStorage থেকে ডেটা লোড ----------
    try {
        const stored = localStorage.getItem('billData');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length) {
                billData = parsed;
            }
        }
    } catch(e) {
        console.error("লোকাল স্টোরেজ লোড এরর:", e);
    }

    // ডেটা খালি থাকলে ডেমো লোড করি
    if (billData.length === 0) {
        billData = billData.concat(demoData);
    }

    // ---------- পাবলিক API ----------
    const dataStore = {
        // সব ডেটা রিটার্ন করবে
        getAll: function() {
            return billData.slice(); // শ্যালো কপি রিটার্ন
        },

        // নতুন ডেটা এড করবে
        add: function(item) {
            if (!item || !item.meter || !item.name || !item.phone) {
                return { success: false, message: 'অবৈধ ডেটা!' };
            }
            
            // ডুপ্লিকেট মিটার চেক
            const exists = billData.some(d => 
                d.meter.toLowerCase() === item.meter.trim().toLowerCase()
            );
            
            if (exists) {
                return { success: false, message: 'এই মিটার নম্বরটি ইতিমধ্যে সংরক্ষিত আছে!' };
            }

            billData.push({
                meter: item.meter.trim(),
                name: item.name.trim(),
                phone: item.phone.trim()
            });

            // লোকাল স্টোরেজে সংরক্ষণ
            try {
                localStorage.setItem('billData', JSON.stringify(billData));
            } catch(e) {
                console.error("ডেটা সেভ এরর:", e);
            }

            return { success: true, message: 'সফলভাবে সংরক্ষিত হয়েছে' };
        },

        // গিটহাব থেকে আসা ডেটা দিয়ে লোকাল ডেটা আপডেট করবে
        setAll: function(serverData) {
            if (Array.isArray(serverData)) {
                billData = serverData;
                try {
                    localStorage.setItem('billData', JSON.stringify(billData));
                } catch(e) {}
            }
        }
    };

    // গ্লোবাল এক্সপোজ
    window.dataStore = dataStore;
    console.log('📦 data.js লোড হয়েছে।');
})();
