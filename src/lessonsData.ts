import { Lesson, WordItem } from './types';

// Helper to generate a unique ID
const genId = () => Math.random().toString(36).substring(2, 9);

// 1. BASIC LEVEL: Keyboard rows muscle memory
export const KEYBOARD_PRACTICE_LESSONS: Lesson[] = [
  {
    id: 'basic_home_row_1',
    name: 'Home Row Basic - Hàng phím cơ sở',
    category: 'home_row',
    level: 'basic',
    description: 'Luyện tập các phím chính: A, S, D, F và J, K, L, ; để đặt ngón đúng vị trí.',
    items: [
      { id: genId(), word: 'asdf', meaning: 'Ngón tay trái đặt trên phím Home' },
      { id: genId(), word: 'jkl;', meaning: 'Ngón tay phải đặt trên phím Home' },
      { id: genId(), word: 'fj', meaning: 'Hai phím có gờ nổi định vị ngón trỏ' },
      { id: genId(), word: 'dk', meaning: 'Phím gõ bằng ngón giữa' },
      { id: genId(), word: 'sl', meaning: 'Phím gõ bằng ngón áp út' },
      { id: genId(), word: 'a;', meaning: 'Phím gõ bằng ngón út' },
      { id: genId(), word: 'ff jj', meaning: 'Luyện nhấn ngón trỏ xen kẽ' },
      { id: genId(), word: 'dd kk', meaning: 'Luyện nhấn ngón giữa xen kẽ' },
      { id: genId(), word: 'ss ll', meaning: 'Luyện nhấn ngón áp út xen kẽ' },
      { id: genId(), word: 'aa ;;', meaning: 'Luyện nhấn ngón út' },
    ],
    displayText: 'asdf jkl; fj dk sl a; ff jj dd kk ss ll aa ;;'
  },
  {
    id: 'basic_home_row_words',
    name: 'Home Row English Words',
    category: 'home_row',
    level: 'basic',
    description: 'Gõ các từ tiếng Anh ngắn được tạo hoàn toàn từ các phím trên hàng cơ sở.',
    items: [
      { id: genId(), word: 'as', ipa: '/æz/', meaning: 'như là, bởi vì', partOfSpeech: 'conjunction' },
      { id: genId(), word: 'ask', ipa: '/ɑːsk/', meaning: 'hỏi, yêu cầu', partOfSpeech: 'verb' },
      { id: genId(), word: 'dad', ipa: '/dæd/', meaning: 'bố, cha', partOfSpeech: 'noun' },
      { id: genId(), word: 'sad', ipa: '/sæd/', meaning: 'buồn bã', partOfSpeech: 'adjective' },
      { id: genId(), word: 'fall', ipa: '/fɔːl/', meaning: 'mùa thu, ngã', partOfSpeech: 'noun/verb' },
      { id: genId(), word: 'glad', ipa: '/ɡlæd/', meaning: 'vui mừng', partOfSpeech: 'adjective' },
      { id: genId(), word: 'flask', ipa: '/flɑːsk/', meaning: 'bình cổ cong, bình thí nghiệm', partOfSpeech: 'noun' },
      { id: genId(), word: 'lad', ipa: '/læd/', meaning: 'chàng trai trẻ', partOfSpeech: 'noun' },
      { id: genId(), word: 'alas', ipa: '/əˈlæs/', meaning: 'than ôi (biểu thị sự nuối tiếc)', partOfSpeech: 'interjection' },
      { id: genId(), word: 'salad', ipa: '/ˈsæləd/', meaning: 'món rau trộn nhóm từ', partOfSpeech: 'noun' },
    ],
    displayText: 'as ask dad sad fall glad flask lad alas salad'
  },
  {
    id: 'basic_top_row_1',
    name: 'Top Row Keys - Hàng phím trên',
    category: 'all_rows',
    level: 'basic',
    description: 'Luyện tập các phím hàng trên: Q, W, E, R, T và Y, U, I, O, P.',
    items: [
      { id: genId(), word: 'qwert', meaning: 'Ngón tay di chuyển chéo lên từ tay trái' },
      { id: genId(), word: 'yuiop', meaning: 'Ngón tay di chuyển chéo lên từ tay phải' },
      { id: genId(), word: 'req', meaning: 'Gõ ngón trỏ, ngón giữa và ngón út tay trái' },
      { id: genId(), word: 'pou', meaning: 'Gõ ngón út, ngón áp út, ngón trỏ tay phải' },
      { id: genId(), word: 'try', meaning: 'thử sức (di chuyển ngón trỏ cả 2 tay)', partOfSpeech: 'verb' },
      { id: genId(), word: 'quiet', ipa: '/ˈkwaɪət/', meaning: 'yên tĩnh', partOfSpeech: 'adjective' },
      { id: genId(), word: 'write', ipa: '/raɪt/', meaning: 'viết', partOfSpeech: 'verb' },
      { id: genId(), word: 'route', ipa: '/ruːt/', meaning: 'tuyến đường', partOfSpeech: 'noun' },
      { id: genId(), word: 'power', ipa: '/ˈpaʊ.ər/', meaning: 'sức mạnh, năng lượng', partOfSpeech: 'noun' },
    ],
    displayText: 'qwert yuiop req pou try quiet write route power'
  },
  {
    id: 'basic_bottom_row_1',
    name: 'Bottom Row Keys - Hàng phím dưới',
    category: 'all_rows',
    level: 'basic',
    description: 'Luyện tập di chuyển xuống hàng dưới: Z, X, C, V, B và N, M, ,, ., /.',
    items: [
      { id: genId(), word: 'zxcvb', meaning: 'Hàng dưới bên tay trái' },
      { id: genId(), word: 'nm,./', meaning: 'Hàng dưới bên tay phải' },
      { id: genId(), word: 'zone', ipa: '/zəʊn/', meaning: 'khu vực, vành đai', partOfSpeech: 'noun' },
      { id: genId(), word: 'voice', ipa: '/vɔɪs/', meaning: 'giọng nói', partOfSpeech: 'noun' },
      { id: genId(), word: 'box', ipa: '/bɒks/', meaning: 'hộp, thùng', partOfSpeech: 'noun' },
      { id: genId(), word: 'come', ipa: '/kʌm/', meaning: 'đến, đi tới', partOfSpeech: 'verb' },
      { id: genId(), word: 'much', ipa: '/mʌtʃ/', meaning: 'nhiều', partOfSpeech: 'adjective/adverb' },
      { id: genId(), word: 'zero', ipa: '/ˈzɪə.rəʊ/', meaning: 'số không', partOfSpeech: 'noun' },
      { id: genId(), word: 'never', ipa: '/ˈnev.ər/', meaning: 'không bao giờ', partOfSpeech: 'adverb' },
    ],
    displayText: 'zxcvb nm,./ zone voice box come much zero never'
  }
];

// 2. INTERMEDIATE LEVEL: Specialized Vocabs (Tech, Business, Medical)
export const INTEGRATED_VOCAB_LESSONS: Lesson[] = [
  {
    id: 'tech_vocab_1',
    name: 'IT & Software Engineering (Tech 1)',
    category: 'tech',
    level: 'intermediate',
    description: 'Từ vựng cốt lõi thường gặp nhất trong ngành Công nghệ thông tin và Lập trình.',
    items: [
      { id: genId(), word: 'variable', ipa: '/ˈveə.ri.ə.bəl/', meaning: 'biến số (chứa dữ liệu)', partOfSpeech: 'noun', example: 'Store the user input inside a variable.', exampleMeaning: 'Lưu trữ dữ liệu đầu vào của người dùng vào một các biến.' },
      { id: genId(), word: 'function', ipa: '/ˈfʌŋk.ʃən/', meaning: 'hàm, chương trình con', partOfSpeech: 'noun', example: 'This function returns a layout format.', exampleMeaning: 'Hàm này trả về một định dạng bố cục.' },
      { id: genId(), word: 'database', ipa: '/ˈdeɪ.tə.beɪs/', meaning: 'cơ sở dữ liệu', partOfSpeech: 'noun', example: 'The stats are saved in a relational database.', exampleMeaning: 'Các số liệu thống kê được lưu trữ trong một cơ sở dữ liệu quan hệ.' },
      { id: genId(), word: 'developer', ipa: '/dɪˈvel.ə.pər/', meaning: 'nhà phát triển (lập trình viên)', partOfSpeech: 'noun', example: 'The developer modified package configurations.', exampleMeaning: 'Nhà phát triển đã sửa đổi các tệp cấu hình gói.' },
      { id: genId(), word: 'algorithm', ipa: '/ˈæl.ɡə.rɪ.ðəm/', meaning: 'thuật toán', partOfSpeech: 'noun', example: 'Sorting algorithms arrange elements sequentially.', exampleMeaning: 'Các thuật toán sắp xếp sắp đặt các phần tử một cách tuần tự.' },
      { id: genId(), word: 'interface', ipa: '/ˈɪn.tə.feɪs/', meaning: 'giao diện, ranh giới kết nối', partOfSpeech: 'noun', example: 'An intuitive interface improves user satisfaction.', exampleMeaning: 'Một giao diện trực quan cải thiện sự hài lòng của người dùng.' },
      { id: genId(), word: 'repository', ipa: '/rɪˈpɒz.ɪ.tər.i/', meaning: 'kho chứa (code, tài nguyên)', partOfSpeech: 'noun', example: 'Clone the code repository from Git.', exampleMeaning: 'Sao chép kho lưu trữ mã nguồn từ Git.' },
      { id: genId(), word: 'compile', ipa: '/kəmˈpaɪl/', meaning: 'biên dịch (sang mã máy)', partOfSpeech: 'verb', example: 'Verify the application before you compile it.', exampleMeaning: 'Xác thực ứng dụng trước khi bạn biên dịch.' },
    ],
    displayText: 'variable function database developer algorithm interface repository compile'
  },
  {
    id: 'business_vocab_1',
    name: 'Business & Finance Essential (Kinh doanh)',
    category: 'business',
    level: 'intermediate',
    description: 'Các từ vựng tiếng Anh chuyên ngành tài chính thương mại quan trọng để nâng cao phản xạ.',
    items: [
      { id: genId(), word: 'investment', ipa: '/ɪnˈvest.mənt/', meaning: 'khoản đầu tư', partOfSpeech: 'noun', example: 'Stocks represent a form of capital investment.', exampleMeaning: 'Cổ phiếu đại diện cho một hình thức đầu tư vốn.' },
      { id: genId(), word: 'negotiation', ipa: '/nəˌɡəʊ.ʃiˈeɪ.ʃən/', meaning: 'sự đàm phán, thương lượng', partOfSpeech: 'noun', example: 'The negotiation ended with a dynamic partnership.', exampleMeaning: 'Cuộc đàm phán kết thúc với một sự hợp tác năng động.' },
      { id: genId(), word: 'liquidity', ipa: '/lɪˈkwɪd.ə.ti/', meaning: 'tính thanh khoản, lưu động', partOfSpeech: 'noun', example: 'High liquidity means it is quick to sell.', exampleMeaning: 'Thanh khoản cao nghĩa là có thể bán nhanh chóng.' },
      { id: genId(), word: 'revenue', ipa: '/ˈrev.ən.juː/', meaning: 'doanh thu, lợi nhuận gộp', partOfSpeech: 'noun', example: 'Company revenue increased in the second quarter.', exampleMeaning: 'Doanh thu công ty đã tăng trong quý hai.' },
      { id: genId(), word: 'leverage', ipa: '/ˈliː.vər.ɪdʒ/', meaning: 'đòn bẩy (tài chính), tận dụng', partOfSpeech: 'noun/verb', example: 'Leverage secondary assets to minimize costs.', exampleMeaning: 'Tận dụng các tài sản phụ để giảm thiểu chi phí.' },
      { id: genId(), word: 'strategy', ipa: '/ˈstræt.ə.dʒi/', meaning: 'chiến lược', partOfSpeech: 'noun', example: 'A clear marketing strategy drives growth.', exampleMeaning: 'Một chiến lược tiếp thị rõ ràng thúc đẩy sự tăng trưởng.' },
      { id: genId(), word: 'inflation', ipa: '/ɪnˈfleɪ.ʃən/', meaning: 'sự lạm phát tiền tệ', partOfSpeech: 'noun', example: 'Central banks raise rates to control inflation.', exampleMeaning: 'Các ngân hàng trung ương tăng lãi suất để kiểm soát lạm phát.' },
    ],
    displayText: 'investment negotiation liquidity revenue leverage strategy inflation'
  },
  {
    id: 'medical_vocab_1',
    name: 'Healthcare & Biology (Y tế sinh học)',
    category: 'medical',
    level: 'intermediate',
    description: 'Từ vựng chuyên môn y khoa thông dụng và danh từ khoa học.',
    items: [
      { id: genId(), word: 'diagnosis', ipa: '/ˌdaɪ.əɡˈnəʊ.sɪs/', meaning: 'sự chẩn đoán bệnh', partOfSpeech: 'noun', example: 'Accurate diagnosis is key to correct therapy.', exampleMeaning: 'Chẩn đoán chính xác là chìa khóa cho liệu pháp đúng đắn.' },
      { id: genId(), word: 'prescription', ipa: '/prɪˈskrɪp.ʃən/', meaning: 'đơn thuốc, toa thuốc', partOfSpeech: 'noun', example: 'The doctor wrote a prescription for antibiotics.', exampleMeaning: 'Bác sĩ đã viết một đơn thuốc kháng sinh.' },
      { id: genId(), word: 'epidemic', ipa: '/ˌep.ɪˈdem.ɪk/', meaning: 'bệnh dịch, dịch bệnh lan truyền', partOfSpeech: 'noun', example: 'The government prepared for the seasonal epidemic.', exampleMeaning: 'Chính phủ đã chuẩn bị cho đợt dịch bệnh theo mùa.' },
      { id: genId(), word: 'chromosome', ipa: '/ˈkrəʊ.mə.səʊm/', meaning: 'nhiễm sắc thể gen di truyền', partOfSpeech: 'noun', example: 'Humans carry twenty-three pairs of chromosomes.', exampleMeaning: 'Con người mang 23 cặp nhiễm sắc thể.' },
      { id: genId(), word: 'immune', ipa: '/ɪˈmjuːn/', meaning: 'miễn dịch, chống chịu', partOfSpeech: 'adjective', example: 'Vitamins help boost the immune system response.', exampleMeaning: 'Các vitamin giúp tăng cường phản ứng của hệ thống miễn dịch.' },
      { id: genId(), word: 'cardiovascular', ipa: '/ˌkɑː.di.əʊˈvæs.kjə.lər/', meaning: 'thuộc về hệ tim mạch', partOfSpeech: 'adjective', example: 'Aerobic exercise improves cardiovascular health.', exampleMeaning: 'Tập thể dục nhịp điệu cải thiện sức khỏe tim mạch.' },
    ],
    displayText: 'diagnosis prescription epidemic chromosome immune cardiovascular'
  }
];

// 3. ADVANCED LEVEL: Conversational & Academic Texts
export const ADVANCED_PRACTICE_LESSONS: Lesson[] = [
  {
    id: 'adv_sentences_1',
    name: 'Daily Conversational Phrases (Giao tiếp hằng ngày)',
    category: 'sentences',
    level: 'advanced',
    description: 'Luyện gõ các cấu trúc câu giao tiếp tự nhiên và học phản xạ diễn đạt ý nghĩa.',
    items: [
      { id: genId(), word: 'Could you please point me in the right direction?', meaning: 'Bạn có thể vui lòng chỉ cho tôi đi đúng hướng không?', ipa: 'Câu lịch sự hỏi đường' },
      { id: genId(), word: 'I appreciate your feedback on the project skeleton.', meaning: 'Tôi đánh giá cao những ý kiến phản hồi của bạn về khung dự án.', ipa: 'Công sở chuyên nghiệp' },
      { id: genId(), word: 'Actions speak louder than words when building trust.', meaning: 'Hành động nói lớn hơn lời nói khi tạo dựng lòng tin.', ipa: 'Thành ngữ nổi tiếng' },
      { id: genId(), word: 'How long does it take to process the local cache?', meaning: 'Mất bao lâu để xử lý bộ đệm cục bộ?', ipa: 'Giao tiếp kỹ thuật' }
    ],
    displayText: 'Could you please point me in the right direction? I appreciate your feedback on the project skeleton. Actions speak louder than words when building trust. How long does it take to process the local cache?'
  },
  {
    id: 'adv_sentences_business',
    name: 'Business English & Workplace (Tiếng Anh văn phòng)',
    category: 'sentences',
    level: 'advanced',
    description: 'Các mẫu câu phổ biến khi viết email, tham gia họp hành và trao đổi nhóm.',
    items: [
      { id: genId(), word: 'Let us touch base next Monday to review the milestones.', meaning: 'Hãy gặp nhau trao đổi vào thứ Hai tới để xem xét các mốc tiến độ.', ipa: 'Lên lịch họp' },
      { id: genId(), word: 'We need to align our visual theme with client preferences.', meaning: 'Chúng ta cần thống nhất chủ đề hình ảnh của mình theo mong muốn khách hàng.', ipa: 'Thống nhất tiêu chí' },
      { id: genId(), word: 'Thank you for your prompt reply regarding the budget calculation.', meaning: 'Cảm ơn vì phản hồi nhanh chóng của bạn liên quan đến việc tính ngân sách.', ipa: 'Hồi âm email' },
      { id: genId(), word: 'Would you mind sharing the slides after the presentation ends?', meaning: 'Bạn có phiền chia sẻ các trang slide sau khi bài thuyết trình kết thúc?', ipa: 'Chia sẻ tài liệu' }
    ],
    displayText: 'Let us touch base next Monday to review the milestones. We need to align our visual theme with client preferences. Thank you for your prompt reply regarding the budget calculation. Would you mind sharing the slides after the presentation ends?'
  }
];

export const ALL_PREINSTALLED_LESSONS: Lesson[] = [
  ...KEYBOARD_PRACTICE_LESSONS,
  ...INTEGRATED_VOCAB_LESSONS,
  ...ADVANCED_PRACTICE_LESSONS
];
