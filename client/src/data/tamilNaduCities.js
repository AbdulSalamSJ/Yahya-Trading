// Comprehensive dataset and dynamic loader for all 11,800+ Tamil Nadu cities, towns, and villages with postal PIN codes
export const TAMIL_NADU_CITIES = [
  // Tenkasi & Tirunelveli Region (Store Home Base)
  { city: 'Puliangudi', pincode: '627855', district: 'Tenkasi' },
  { city: 'Tenkasi', pincode: '627811', district: 'Tenkasi' },
  { city: 'Kadayanallur', pincode: '627751', district: 'Tenkasi' },
  { city: 'Sankarankovil', pincode: '627756', district: 'Tenkasi' },
  { city: 'Surandai', pincode: '627859', district: 'Tenkasi' },
  { city: 'Shenkottai', pincode: '627809', district: 'Tenkasi', aliases: ['Sengottai'] },
  { city: 'Alangulam', pincode: '627851', district: 'Tenkasi' },
  { city: 'Pavoorchatram', pincode: '627808', district: 'Tenkasi' },
  { city: 'Vasudevanallur', pincode: '627758', district: 'Tenkasi' },
  { city: 'Sivagiri', pincode: '627757', district: 'Tenkasi' },
  { city: 'Rayagiri', pincode: '627764', district: 'Tenkasi' },
  { city: 'Courtallam', pincode: '627802', district: 'Tenkasi', aliases: ['Kutralam'] },
  { city: 'Ayikudi', pincode: '627852', district: 'Tenkasi' },
  { city: 'Sambavar Vadagarai', pincode: '627856', district: 'Tenkasi' },
  { city: 'Ilanji', pincode: '627805', district: 'Tenkasi' },
  { city: 'Sundarapandiapuram', pincode: '627858', district: 'Tenkasi' },
  { city: 'Tirunelveli', pincode: '627001', district: 'Tirunelveli', aliases: ['Nellai'] },
  { city: 'Palayamkottai', pincode: '627002', district: 'Tirunelveli' },
  { city: 'Melapalayam', pincode: '627005', district: 'Tirunelveli' },
  { city: 'Ambasamudram', pincode: '627401', district: 'Tirunelveli' },
  { city: 'Kallidaikurichi', pincode: '627416', district: 'Tirunelveli' },
  { city: 'Cheranmahadevi', pincode: '627414', district: 'Tirunelveli' },
  { city: 'Veeravanallur', pincode: '627426', district: 'Tirunelveli' },
  { city: 'Vickramasingapuram', pincode: '627425', district: 'Tirunelveli', aliases: ['VK Puram'] },
  { city: 'Alwarkurichi', pincode: '627412', district: 'Tirunelveli' },
  { city: 'Mukkudal', pincode: '627601', district: 'Tirunelveli' },
  { city: 'Valliyur', pincode: '627117', district: 'Tirunelveli' },
  { city: 'Nanguneri', pincode: '627108', district: 'Tirunelveli' },
  { city: 'Kalakkad', pincode: '627501', district: 'Tirunelveli' },
  { city: 'Panagudi', pincode: '627109', district: 'Tirunelveli' },
  { city: 'Radhapuram', pincode: '627111', district: 'Tirunelveli' },
  { city: 'Thisayanvilai', pincode: '627657', district: 'Tirunelveli' },
  { city: 'Kudankulam', pincode: '627106', district: 'Tirunelveli' },

  // Chennai & Metro Suburbs
  { city: 'Chennai', pincode: '600001', district: 'Chennai', aliases: ['Madras'] },
  { city: 'T Nagar', pincode: '600017', district: 'Chennai', aliases: ['Thyagaraya Nagar'] },
  { city: 'Anna Nagar', pincode: '600040', district: 'Chennai' },
  { city: 'Adyar', pincode: '600020', district: 'Chennai' },
  { city: 'Velachery', pincode: '600042', district: 'Chennai' },
  { city: 'Mylapore', pincode: '600004', district: 'Chennai' },
  { city: 'Guindy', pincode: '600032', district: 'Chennai' },
  { city: 'Porur', pincode: '600116', district: 'Chennai' },
  { city: 'Tambaram', pincode: '600045', district: 'Chengalpattu' },
  { city: 'Chromepet', pincode: '600044', district: 'Chengalpattu' },
  { city: 'Pallavaram', pincode: '600043', district: 'Chengalpattu' },
  { city: 'Avadi', pincode: '600054', district: 'Tiruvallur' },
  { city: 'Ambattur', pincode: '600053', district: 'Chennai' },
  { city: 'Poonamallee', pincode: '600056', district: 'Tiruvallur' },
  { city: 'Red Hills', pincode: '600052', district: 'Tiruvallur' },
  { city: 'Madhavaram', pincode: '600060', district: 'Chennai' },
  { city: 'Tiruvottiyur', pincode: '600019', district: 'Chennai' },
  { city: 'Sholinganallur', pincode: '600119', district: 'Chennai' },
  { city: 'Thoraipakkam', pincode: '600097', district: 'Chennai', aliases: ['OMR'] },
  { city: 'Perungudi', pincode: '600096', district: 'Chennai' },
  { city: 'Medavakkam', pincode: '600100', district: 'Chengalpattu' },
  { city: 'Perumbakkam', pincode: '600100', district: 'Chengalpattu' },
  { city: 'Navalur', pincode: '603103', district: 'Chengalpattu' },
  { city: 'Siruseri', pincode: '603103', district: 'Chengalpattu' },
  { city: 'Kelambakkam', pincode: '603103', district: 'Chengalpattu' },
  { city: 'Maraimalai Nagar', pincode: '603209', district: 'Chengalpattu' },
  { city: 'Chengalpattu', pincode: '603001', district: 'Chengalpattu', aliases: ['Chingleput'] },
  { city: 'Mahabalipuram', pincode: '603104', district: 'Chengalpattu', aliases: ['Mamallapuram'] },
  { city: 'Madurantakam', pincode: '603306', district: 'Chengalpattu' },

  // Coimbatore & Kongu Region
  { city: 'Coimbatore', pincode: '641001', district: 'Coimbatore', aliases: ['Kovai', 'CBE'] },
  { city: 'RS Puram', pincode: '641002', district: 'Coimbatore' },
  { city: 'Gandhipuram', pincode: '641012', district: 'Coimbatore' },
  { city: 'Peelamedu', pincode: '641004', district: 'Coimbatore' },
  { city: 'Saravanampatti', pincode: '641035', district: 'Coimbatore' },
  { city: 'Singanallur', pincode: '641005', district: 'Coimbatore' },
  { city: 'Kuniyamuthur', pincode: '641008', district: 'Coimbatore' },
  { city: 'Pollachi', pincode: '642001', district: 'Coimbatore' },
  { city: 'Mettupalayam', pincode: '641301', district: 'Coimbatore' },
  { city: 'Sulur', pincode: '641402', district: 'Coimbatore' },
  { city: 'Thudiyalur', pincode: '641034', district: 'Coimbatore' },
  { city: 'Karamadai', pincode: '641104', district: 'Coimbatore' },
  { city: 'Annur', pincode: '641653', district: 'Coimbatore' },
  { city: 'Kinathukadavu', pincode: '642109', district: 'Coimbatore' },
  { city: 'Valparai', pincode: '642127', district: 'Coimbatore' },

  // Tiruppur
  { city: 'Tiruppur', pincode: '641601', district: 'Tiruppur', aliases: ['Tirupur'] },
  { city: 'Avinashi', pincode: '641654', district: 'Tiruppur' },
  { city: 'Palladam', pincode: '641664', district: 'Tiruppur' },
  { city: 'Dharapuram', pincode: '638656', district: 'Tiruppur' },
  { city: 'Kangeyam', pincode: '638701', district: 'Tiruppur' },
  { city: 'Udumalaipettai', pincode: '642126', district: 'Tiruppur', aliases: ['Udumalpet'] },
  { city: 'Vellakoil', pincode: '638111', district: 'Tiruppur' },
  { city: 'Madathukulam', pincode: '642113', district: 'Tiruppur' },

  // Madurai & Southern Districts
  { city: 'Madurai', pincode: '625001', district: 'Madurai' },
  { city: 'Anna Nagar Madurai', pincode: '625020', district: 'Madurai' },
  { city: 'Koodal Nagar', pincode: '625018', district: 'Madurai' },
  { city: 'Thirunagar', pincode: '625006', district: 'Madurai' },
  { city: 'Tirumangalam', pincode: '625706', district: 'Madurai' },
  { city: 'Melur', pincode: '625106', district: 'Madurai' },
  { city: 'Usilampatti', pincode: '625532', district: 'Madurai' },
  { city: 'Sholavandan', pincode: '625214', district: 'Madurai' },
  { city: 'Vadipatti', pincode: '625218', district: 'Madurai' },

  // Virudhunagar
  { city: 'Virudhunagar', pincode: '626001', district: 'Virudhunagar' },
  { city: 'Rajapalayam', pincode: '626117', district: 'Virudhunagar' },
  { city: 'Sivakasi', pincode: '626123', district: 'Virudhunagar' },
  { city: 'Srivilliputhur', pincode: '626125', district: 'Virudhunagar', aliases: ['Srivilliputtur'] },
  { city: 'Aruppukottai', pincode: '626101', district: 'Virudhunagar' },
  { city: 'Sattur', pincode: '626203', district: 'Virudhunagar' },
  { city: 'Watrap', pincode: '626132', district: 'Virudhunagar' },
  { city: 'Kariapatti', pincode: '626106', district: 'Virudhunagar' },

  // Thoothukudi (Tuticorin)
  { city: 'Thoothukudi', pincode: '628001', district: 'Thoothukudi', aliases: ['Tuticorin'] },
  { city: 'Kovilpatti', pincode: '628501', district: 'Thoothukudi' },
  { city: 'Tiruchendur', pincode: '628215', district: 'Thoothukudi' },
  { city: 'Kayalpattinam', pincode: '628204', district: 'Thoothukudi' },
  { city: 'Eral', pincode: '628801', district: 'Thoothukudi' },
  { city: 'Sathankulam', pincode: '628704', district: 'Thoothukudi' },
  { city: 'Srivaikuntam', pincode: '628601', district: 'Thoothukudi' },
  { city: 'Vilathikulam', pincode: '628907', district: 'Thoothukudi' },
  { city: 'Ottapidaram', pincode: '628401', district: 'Thoothukudi' },
  { city: 'Udangudi', pincode: '628203', district: 'Thoothukudi' },

  // Kanyakumari
  { city: 'Nagercoil', pincode: '629001', district: 'Kanyakumari' },
  { city: 'Kanyakumari', pincode: '629702', district: 'Kanyakumari', aliases: ['Cape Comorin'] },
  { city: 'Marthandam', pincode: '629165', district: 'Kanyakumari' },
  { city: 'Thuckalay', pincode: '629175', district: 'Kanyakumari' },
  { city: 'Colachel', pincode: '629251', district: 'Kanyakumari' },
  { city: 'Padmanabhapuram', pincode: '629175', district: 'Kanyakumari' },
  { city: 'Kuzhithurai', pincode: '629163', district: 'Kanyakumari' },
  { city: 'Karungal', pincode: '629157', district: 'Kanyakumari' },
  { city: 'Killiyoor', pincode: '629171', district: 'Kanyakumari' },

  // Trichy (Tiruchirappalli)
  { city: 'Tiruchirappalli', pincode: '620001', district: 'Tiruchirappalli', aliases: ['Trichy', 'Tiruchi'] },
  { city: 'Srirangam', pincode: '620006', district: 'Tiruchirappalli' },
  { city: 'Thillai Nagar', pincode: '620018', district: 'Tiruchirappalli' },
  { city: 'K K Nagar Trichy', pincode: '620021', district: 'Tiruchirappalli' },
  { city: 'Manapparai', pincode: '621306', district: 'Tiruchirappalli' },
  { city: 'Thuraiyur', pincode: '621010', district: 'Tiruchirappalli' },
  { city: 'Musiri', pincode: '621211', district: 'Tiruchirappalli' },
  { city: 'Lalgudi', pincode: '621601', district: 'Tiruchirappalli' },
  { city: 'Tiruverumbur', pincode: '620013', district: 'Tiruchirappalli' },

  // Salem
  { city: 'Salem', pincode: '636001', district: 'Salem' },
  { city: 'Attur', pincode: '636102', district: 'Salem' },
  { city: 'Mettur', pincode: '636401', district: 'Salem', aliases: ['Mettur Dam'] },
  { city: 'Omalur', pincode: '636455', district: 'Salem' },
  { city: 'Sankari', pincode: '637301', district: 'Salem' },
  { city: 'Edappadi', pincode: '637101', district: 'Salem' },
  { city: 'Yercaud', pincode: '636601', district: 'Salem' },
  { city: 'Valapady', pincode: '636115', district: 'Salem' },

  // Erode
  { city: 'Erode', pincode: '638001', district: 'Erode' },
  { city: 'Bhavani', pincode: '638301', district: 'Erode' },
  { city: 'Gobichettipalayam', pincode: '638452', district: 'Erode', aliases: ['Gobi'] },
  { city: 'Perundurai', pincode: '638052', district: 'Erode' },
  { city: 'Sathyamangalam', pincode: '638402', district: 'Erode', aliases: ['Sathy'] },
  { city: 'Anthiyur', pincode: '638501', district: 'Erode' },
  { city: 'Kodumudi', pincode: '638151', district: 'Erode' },

  // Thanjavur & Delta
  { city: 'Thanjavur', pincode: '613001', district: 'Thanjavur', aliases: ['Tanjore'] },
  { city: 'Kumbakonam', pincode: '612001', district: 'Thanjavur' },
  { city: 'Pattukkottai', pincode: '614601', district: 'Thanjavur' },
  { city: 'Orathanadu', pincode: '614625', district: 'Thanjavur' },
  { city: 'Thiruvaiyaru', pincode: '613204', district: 'Thanjavur' },
  { city: 'Peravurani', pincode: '614804', district: 'Thanjavur' },

  // Tiruvarur, Nagapattinam & Mayiladuthurai
  { city: 'Tiruvarur', pincode: '610001', district: 'Tiruvarur' },
  { city: 'Mannargudi', pincode: '614001', district: 'Tiruvarur' },
  { city: 'Thiruthuraipoondi', pincode: '614713', district: 'Tiruvarur' },
  { city: 'Nagapattinam', pincode: '611001', district: 'Nagapattinam' },
  { city: 'Velankanni', pincode: '611111', district: 'Nagapattinam' },
  { city: 'Vedaranyam', pincode: '614810', district: 'Nagapattinam' },
  { city: 'Mayiladuthurai', pincode: '609001', district: 'Mayiladuthurai', aliases: ['Mayavaram'] },
  { city: 'Sirkazhi', pincode: '609110', district: 'Mayiladuthurai' },
  { city: 'Tharangambadi', pincode: '609313', district: 'Mayiladuthurai', aliases: ['Tranquebar'] },

  // Dindigul & Theni
  { city: 'Dindigul', pincode: '624001', district: 'Dindigul' },
  { city: 'Palani', pincode: '624601', district: 'Dindigul', aliases: ['Palani Murugan'] },
  { city: 'Kodaikanal', pincode: '624101', district: 'Dindigul' },
  { city: 'Oddanchatram', pincode: '624619', district: 'Dindigul' },
  { city: 'Natham', pincode: '624401', district: 'Dindigul' },
  { city: 'Nilakkottai', pincode: '624208', district: 'Dindigul' },
  { city: 'Theni', pincode: '625531', district: 'Theni' },
  { city: 'Bodinayakanur', pincode: '625513', district: 'Theni', aliases: ['Bodi'] },
  { city: 'Periyakulam', pincode: '625601', district: 'Theni' },
  { city: 'Cumbum', pincode: '625516', district: 'Theni' },
  { city: 'Uthamapalayam', pincode: '625533', district: 'Theni' },
  { city: 'Chinnamanur', pincode: '625515', district: 'Theni' },
  { city: 'Andipatti', pincode: '625512', district: 'Theni' },

  // Ramanathapuram & Sivaganga
  { city: 'Ramanathapuram', pincode: '623501', district: 'Ramanathapuram', aliases: ['Ramnad'] },
  { city: 'Rameswaram', pincode: '623526', district: 'Ramanathapuram' },
  { city: 'Paramakudi', pincode: '623707', district: 'Ramanathapuram' },
  { city: 'Kilakarai', pincode: '623517', district: 'Ramanathapuram' },
  { city: 'Kamuthi', pincode: '623603', district: 'Ramanathapuram' },
  { city: 'Sivaganga', pincode: '630561', district: 'Sivaganga' },
  { city: 'Karaikudi', pincode: '630001', district: 'Sivaganga', aliases: ['Chettinad'] },
  { city: 'Devakottai', pincode: '630302', district: 'Sivaganga' },
  { city: 'Manamadurai', pincode: '630606', district: 'Sivaganga' },
  { city: 'Tiruppuvanam', pincode: '630611', district: 'Sivaganga' },

  // Vellore, Ranipet, Tirupattur & Tiruvannamalai
  { city: 'Vellore', pincode: '632001', district: 'Vellore' },
  { city: 'Katpadi', pincode: '632007', district: 'Vellore' },
  { city: 'Gudiyatham', pincode: '632602', district: 'Vellore' },
  { city: 'Ranipet', pincode: '632401', district: 'Ranipet' },
  { city: 'Arcot', pincode: '632503', district: 'Ranipet' },
  { city: 'Arakkonam', pincode: '631001', district: 'Ranipet' },
  { city: 'Walajapet', pincode: '632513', district: 'Ranipet' },
  { city: 'Sholinghur', pincode: '631102', district: 'Ranipet' },
  { city: 'Tirupattur', pincode: '635601', district: 'Tirupattur' },
  { city: 'Vaniyambadi', pincode: '635751', district: 'Tirupattur' },
  { city: 'Ambur', pincode: '635802', district: 'Tirupattur' },
  { city: 'Jolarpet', pincode: '635851', district: 'Tirupattur' },
  { city: 'Tiruvannamalai', pincode: '606601', district: 'Tiruvannamalai' },
  { city: 'Arani', pincode: '632301', district: 'Tiruvannamalai' },
  { city: 'Cheyyar', pincode: '604407', district: 'Tiruvannamalai' },
  { city: 'Polur', pincode: '606803', district: 'Tiruvannamalai' },
  { city: 'Chengam', pincode: '606701', district: 'Tiruvannamalai' },

  // Kanchipuram & Tiruvallur
  { city: 'Kanchipuram', pincode: '631501', district: 'Kanchipuram', aliases: ['Kanchi'] },
  { city: 'Sriperumbudur', pincode: '602105', district: 'Kanchipuram' },
  { city: 'Walajabad', pincode: '631605', district: 'Kanchipuram' },
  { city: 'Uthiramerur', pincode: '603406', district: 'Kanchipuram' },
  { city: 'Tiruvallur', pincode: '602001', district: 'Tiruvallur' },
  { city: 'Tiruttani', pincode: '631209', district: 'Tiruvallur' },
  { city: 'Gummidipoondi', pincode: '601201', district: 'Tiruvallur' },
  { city: 'Ponneri', pincode: '601204', district: 'Tiruvallur' },
  { city: 'Uthukkottai', pincode: '602026', district: 'Tiruvallur' },

  // Cuddalore, Villupuram & Kallakurichi
  { city: 'Cuddalore', pincode: '607001', district: 'Cuddalore' },
  { city: 'Chidambaram', pincode: '608001', district: 'Cuddalore' },
  { city: 'Panruti', pincode: '607106', district: 'Cuddalore' },
  { city: 'Neyveli', pincode: '607801', district: 'Cuddalore' },
  { city: 'Vridhachalam', pincode: '606001', district: 'Cuddalore' },
  { city: 'Tittagudi', pincode: '606106', district: 'Cuddalore' },
  { city: 'Villupuram', pincode: '605602', district: 'Villupuram' },
  { city: 'Tindivanam', pincode: '604001', district: 'Villupuram' },
  { city: 'Gingee', pincode: '604202', district: 'Villupuram' },
  { city: 'Vanur', pincode: '605109', district: 'Villupuram' },
  { city: 'Kallakurichi', pincode: '606202', district: 'Kallakurichi' },
  { city: 'Ulundurpet', pincode: '606107', district: 'Kallakurichi' },
  { city: 'Sankarapuram', pincode: '606401', district: 'Kallakurichi' },
  { city: 'Chinnasalem', pincode: '606201', district: 'Kallakurichi' },

  // Dharmapuri & Krishnagiri
  { city: 'Dharmapuri', pincode: '636701', district: 'Dharmapuri' },
  { city: 'Harur', pincode: '636903', district: 'Dharmapuri' },
  { city: 'Palacode', pincode: '636808', district: 'Dharmapuri' },
  { city: 'Pennagaram', pincode: '636810', district: 'Dharmapuri' },
  { city: 'Krishnagiri', pincode: '635001', district: 'Krishnagiri' },
  { city: 'Hosur', pincode: '635109', district: 'Krishnagiri' },
  { city: 'Denkanikottai', pincode: '635107', district: 'Krishnagiri' },
  { city: 'Pochampalli', pincode: '635206', district: 'Krishnagiri' },
  { city: 'Uthangarai', pincode: '635207', district: 'Krishnagiri' },

  // Namakkal
  { city: 'Namakkal', pincode: '637001', district: 'Namakkal' },
  { city: 'Tiruchengode', pincode: '637211', district: 'Namakkal' },
  { city: 'Rasipuram', pincode: '637408', district: 'Namakkal' },
  { city: 'Paramathi Velur', pincode: '637207', district: 'Namakkal' },
  { city: 'Komarapalayam', pincode: '638183', district: 'Namakkal' },
  { city: 'Kolli Hills', pincode: '637411', district: 'Namakkal' },

  // Pudukkottai, Perambalur & Ariyalur
  { city: 'Pudukkottai', pincode: '622001', district: 'Pudukkottai' },
  { city: 'Aranthangi', pincode: '614616', district: 'Pudukkottai' },
  { city: 'Illuppur', pincode: '622102', district: 'Pudukkottai' },
  { city: 'Alangudi', pincode: '622301', district: 'Pudukkottai' },
  { city: 'Perambalur', pincode: '621212', district: 'Perambalur' },
  { city: 'Veppanthattai', pincode: '621116', district: 'Perambalur' },
  { city: 'Ariyalur', pincode: '621704', district: 'Ariyalur' },
  { city: 'Jayankondam', pincode: '621802', district: 'Ariyalur' },
  { city: 'Sendurai', pincode: '621714', district: 'Ariyalur' },

  // The Nilgiris
  { city: 'Udhagamandalam', pincode: '643001', district: 'The Nilgiris', aliases: ['Ooty', 'Ootacamund'] },
  { city: 'Coonoor', pincode: '643101', district: 'The Nilgiris' },
  { city: 'Kotagiri', pincode: '643217', district: 'The Nilgiris' },
  { city: 'Gudalur', pincode: '643212', district: 'The Nilgiris' },
  { city: 'Wellington', pincode: '643231', district: 'The Nilgiris' },
  { city: 'Aruvankadu', pincode: '643202', district: 'The Nilgiris' }
];

// In-memory cache for all 11,800+ Tamil Nadu villages, towns, and cities
let allLocationsCache = null;
let loadPromise = null;

/**
 * Loads all 11,800+ Tamil Nadu villages, towns, and cities from public data JSON.
 * Caches in browser RAM for instantaneous subsequent queries (< 2ms).
 */
export async function loadAllTamilNaduLocations() {
  if (allLocationsCache) return allLocationsCache;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const res = await fetch('/data/tamilNaduLocations.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      allLocationsCache = data.map(item => ({
        city: item.name,
        pincode: item.pincode,
        district: item.district,
        taluk: item.taluk || '',
        type: item.type || 'Village',
        aliases: item.aliases || []
      }));
      return allLocationsCache;
    } catch (err) {
      console.warn('Could not load full Tamil Nadu village locations JSON, using curated fallback:', err);
      allLocationsCache = TAMIL_NADU_CITIES;
      return allLocationsCache;
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
}

// Automatically initiate background preload in browser environment
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => { loadAllTamilNaduLocations(); });
  } else {
    setTimeout(loadAllTamilNaduLocations, 300);
  }
}

/**
 * Check if the full database of 11,800+ locations is loaded
 */
export function isLocationsDatabaseLoaded() {
  return allLocationsCache !== null && allLocationsCache.length > 500;
}

/**
 * Searches Tamil Nadu cities, towns, and villages by query.
 * Matches:
 * 1. Exact city/village name matches
 * 2. Prefix matches on city/village name
 * 3. Aliases (e.g. Ooty, Trichy, Tuticorin, Nellai, Kovai)
 * 4. Substring matches on city/village name
 * 5. District or Taluk matches
 * 6. PIN code prefix matches
 */
export function searchTamilNaduCities(query, limit = 15) {
  if (!query || typeof query !== 'string') return [];
  const clean = query.trim().toLowerCase();
  if (clean.length === 0) return [];

  const dataset = allLocationsCache || TAMIL_NADU_CITIES;

  const exactMatches = [];
  const prefixMatches = [];
  const aliasMatches = [];
  const substringMatches = [];
  const districtOrPinMatches = [];
  const seen = new Set();

  for (let i = 0; i < dataset.length; i++) {
    const item = dataset[i];
    const cityName = item.city || item.name;
    if (!cityName) continue;

    const cityNameLower = cityName.toLowerCase();
    const districtLower = (item.district || '').toLowerCase();
    const talukLower = (item.taluk || '').toLowerCase();
    const aliases = (item.aliases || []).map(a => a.toLowerCase());

    const key = `${cityNameLower}|${item.pincode}`;
    if (seen.has(key)) continue;

    if (cityNameLower === clean) {
      seen.add(key);
      exactMatches.push(item);
    } else if (cityNameLower.startsWith(clean)) {
      seen.add(key);
      prefixMatches.push(item);
    } else if (aliases.some(a => a.startsWith(clean) || a === clean)) {
      seen.add(key);
      aliasMatches.push(item);
    } else if (cityNameLower.includes(clean)) {
      seen.add(key);
      substringMatches.push(item);
    } else if (
      districtLower.includes(clean) ||
      talukLower.includes(clean) ||
      aliases.some(a => a.includes(clean)) ||
      item.pincode.startsWith(clean)
    ) {
      seen.add(key);
      districtOrPinMatches.push(item);
    }

    if (exactMatches.length + prefixMatches.length >= limit) {
      break;
    }
  }

  return [
    ...exactMatches,
    ...prefixMatches,
    ...aliasMatches,
    ...substringMatches,
    ...districtOrPinMatches
  ].slice(0, limit);
}

/**
 * Finds exact or closest PIN code for a given city or village name
 */
export function getPincodeForCity(cityName) {
  if (!cityName) return '';
  const clean = cityName.trim().toLowerCase();
  const dataset = allLocationsCache || TAMIL_NADU_CITIES;

  const match = dataset.find(
    c => {
      const name = (c.city || c.name || '').toLowerCase();
      if (name === clean) return true;
      if (c.aliases && c.aliases.some(a => a.toLowerCase() === clean)) return true;
      return false;
    }
  );
  return match ? match.pincode : '';
}
