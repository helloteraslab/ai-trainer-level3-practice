window.QUESTION_BANK = {
  "source": {
    "name": "人工智能训练师三级实操题库",
    "workspace": "人工智能训练师三级备考",
    "priority": "local_practice_bank_first",
    "directories": [
      "人工智能训练师三级考试平台模拟界面",
      "人工智能训练师三级上网素材",
      "08_实操题代码笔记"
    ]
  },
  "rawQuestions": [
    {
      "id": "raw_1_1_1",
      "source_type": "ai_trainer_practice_bank",
      "question_no": "1.1.1",
      "title": "智能医疗系统中的业务数据处理流程设计",
      "body": "根据 patient_data.csv 完成高风险患者、BMI 区间和年龄区间统计。",
      "language": "python",
      "difficulty": 2,
      "is_code_question": true,
      "assets": [
        "patient_data.csv",
        "1.1.1.ipynb"
      ],
      "skills": [
        "Pandas",
        "pd.read_csv",
        "np.where",
        "pd.cut",
        "groupby",
        "value_counts"
      ]
    },
    {
      "id": "raw_1_1_2",
      "source_type": "ai_trainer_practice_bank",
      "question_no": "1.1.2",
      "title": "智能农业系统中的传感器数据采集和处理",
      "body": "根据 sensor_data.csv 完成传感器统计、温湿度筛选、异常值标记、缺失值填充和导出。",
      "language": "python",
      "difficulty": 2,
      "is_code_question": true,
      "assets": [
        "sensor_data.csv",
        "1.1.2.ipynb"
      ],
      "skills": [
        "Pandas",
        "groupby",
        "agg",
        "isin",
        "np.where",
        "ffill",
        "bfill",
        "to_csv"
      ]
    },
    {
      "id": "raw_1_1_3",
      "source_type": "ai_trainer_practice_bank",
      "question_no": "1.1.3",
      "title": "信用数据质量审核与合理性检查",
      "body": "根据 credit_data.csv 完成缺失值、重复值、字段合理性和综合有效性检查。",
      "language": "python",
      "difficulty": 2,
      "is_code_question": true,
      "assets": [
        "credit_data.csv",
        "1.1.3.ipynb"
      ],
      "skills": [
        "Pandas",
        "isnull",
        "duplicated",
        "between",
        "all(axis=1)"
      ]
    }
  ],
  "skills": [
    {
      "id": "python",
      "name": "Python 基础",
      "parent_id": null,
      "category": "foundation"
    },
    {
      "id": "pandas",
      "name": "Pandas 数据处理",
      "parent_id": "python",
      "category": "data"
    },
    {
      "id": "data_cleaning",
      "name": "数据清洗",
      "parent_id": "pandas",
      "category": "data"
    },
    {
      "id": "groupby",
      "name": "groupby 分组聚合",
      "parent_id": "pandas",
      "category": "data"
    },
    {
      "id": "filtering",
      "name": "数据筛选",
      "parent_id": "pandas",
      "category": "data"
    },
    {
      "id": "validation",
      "name": "数据质量审核",
      "parent_id": "data_cleaning",
      "category": "data"
    },
    {
      "id": "ml",
      "name": "机器学习基础",
      "parent_id": "python",
      "category": "modeling"
    },
    {
      "id": "prompt",
      "name": "Prompt Engineering",
      "parent_id": null,
      "category": "ai"
    },
    {
      "id": "llm",
      "name": "大模型应用",
      "parent_id": "prompt",
      "category": "ai"
    },
    {
      "id": "agent",
      "name": "Agent 基础",
      "parent_id": "llm",
      "category": "ai"
    }
  ],
  "learningItems": [
    {
      "id": "blank_1_1_1_read_csv_rhs",
      "raw_question_id": "raw_1_1_1",
      "item_type": "blank",
      "title": "读取医疗数据集",
      "prompt": "原题空位：data = _____________。应填什么？",
      "starter_code": "import pandas as pd\nimport numpy as np\n\n# 读取数据集\ndata = _____________",
      "answer_json": {
        "accepted_answers": [
          "pd.read_csv('patient_data.csv')",
          "pd.read_csv(\"patient_data.csv\")",
          "pd.read_csv('patient_data.csv')",
          "read_csv"
        ]
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "pd.read_csv",
        "patient_data.csv"
      ],
      "mastery_level": 1,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "标准答案是用 pd.read_csv 读取 patient_data.csv。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "读取 CSV 文件用 pd.read_csv(\"文件名\")。"
      },
      "task_hint": "读取数据集 1分"
    },
    {
      "id": "blank_1_1_1_risk_np_where",
      "raw_question_id": "raw_1_1_1",
      "item_type": "blank",
      "title": "根据住院天数生成 RiskLevel",
      "prompt": "原题空位：data['RiskLevel'] = ____(data['DaysInHospital'] > 7, '高风险患者', '低风险患者')。函数名填什么？",
      "starter_code": "data['RiskLevel'] = ____(data['DaysInHospital'] > 7, '高风险患者', '低风险患者')",
      "answer_json": {
        "accepted_answers": [
          "np.where",
          "where"
        ]
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "np.where",
        "RiskLevel",
        "DaysInHospital"
      ],
      "mastery_level": 2,
      "estimated_seconds": 45,
      "xp": 10,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "二选一条件分类用 np.where。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "np.where(条件, 条件成立值, 条件不成立值)。"
      },
      "task_hint": "创建新列 'RiskLevel'，根据住院天数判断风险等级 3分"
    },
    {
      "id": "choice_1_1_1_bmi_cut_function",
      "raw_question_id": "raw_1_1_1",
      "item_type": "choice",
      "title": "BMI 区间划分函数选择",
      "prompt": "原题空位：data['BMIRange'] = ____(data['BMI'], bins=bmi_bins, labels=bmi_labels, right=False)。这个空应该选哪个函数？",
      "starter_code": "data['BMIRange'] = ____(data['BMI'], bins=bmi_bins, labels=bmi_labels, right=False)",
      "answer_json": {
        "options": [
          "pd.cut",
          "np.where",
          "value_counts",
          "pd.read_csv"
        ],
        "correct_option": "pd.cut"
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "pd.cut",
        "BMI",
        "区间划分"
      ],
      "mastery_level": 2,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "BMI、年龄这种区间划分用 pd.cut。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "连续数值切区间：pd.cut(列, bins=..., labels=...)。"
      },
      "task_hint": "根据 BMI 值划分指定区间 4分"
    },
    {
      "id": "blank_1_1_1_bmi_groupby",
      "raw_question_id": "raw_1_1_1",
      "item_type": "blank",
      "title": "按 BMI 区间计算高风险比例",
      "prompt": "原题空位：bmi_risk_rate = ____('BMIRange')['RiskLevel'].apply(...)。应填什么？",
      "starter_code": "bmi_risk_rate = ____('BMIRange')['RiskLevel'].apply(lambda x: (x == '高风险患者').mean())",
      "answer_json": {
        "accepted_answers": [
          "data.groupby",
          "data.groupby"
        ]
      },
      "skills": [
        "pandas",
        "groupby"
      ],
      "knowledge_points": [
        "groupby",
        "BMIRange",
        "RiskLevel"
      ],
      "mastery_level": 2,
      "estimated_seconds": 45,
      "xp": 10,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "按 BMI 区间分组应使用 data.groupby。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "分组统计常用 data.groupby(\"分组列\")[\"统计列\"]。"
      },
      "task_hint": "计算每个 BMI 区间中高风险患者的比例 2分"
    },
    {
      "id": "blank_1_1_1_bmi_value_counts",
      "raw_question_id": "raw_1_1_1",
      "item_type": "blank",
      "title": "统计每个 BMI 区间患者数",
      "prompt": "原题空位：bmi_patient_count = data['BMIRange'].____。应填什么？",
      "starter_code": "bmi_patient_count = data['BMIRange'].____",
      "answer_json": {
        "accepted_answers": [
          "value_counts()",
          "value_counts"
        ]
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "value_counts",
        "BMIRange"
      ],
      "mastery_level": 2,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "统计分类值数量用 value_counts()。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "每个类别有多少条，用 value_counts()。"
      },
      "task_hint": "统计每个 BMI 区间的患者数量 1分"
    },
    {
      "id": "choice_1_1_1_age_cut_function",
      "raw_question_id": "raw_1_1_1",
      "item_type": "choice",
      "title": "年龄区间划分函数选择",
      "prompt": "原题空位：data['AgeRange'] = ____(data['Age'], bins=age_bins, labels=age_labels, right=False)。这个空应该选哪个函数？",
      "starter_code": "data['AgeRange'] = ____(data['Age'], bins=age_bins, labels=age_labels, right=False)",
      "answer_json": {
        "options": [
          "pd.cut",
          "np.where",
          "duplicated",
          "dropna"
        ],
        "correct_option": "pd.cut"
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "pd.cut",
        "AgeRange"
      ],
      "mastery_level": 2,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "年龄区间也是连续值分箱，用 pd.cut。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "看到 bins、labels、right=False，优先想到 pd.cut。"
      },
      "task_hint": "根据年龄值划分指定区间 4分"
    },
    {
      "id": "blank_1_1_2_read_csv_rhs",
      "raw_question_id": "raw_1_1_2",
      "item_type": "blank",
      "title": "读取传感器数据集",
      "prompt": "原题空位：data = _____________。应填什么？",
      "starter_code": "import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# 读取数据集\ndata = _____________",
      "answer_json": {
        "accepted_answers": [
          "pd.read_csv('sensor_data.csv')",
          "pd.read_csv(\"sensor_data.csv\")",
          "read_csv"
        ]
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "pd.read_csv",
        "sensor_data.csv"
      ],
      "mastery_level": 1,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "标准答案是用 pd.read_csv 读取 sensor_data.csv。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "读取 CSV 文件用 pd.read_csv。"
      },
      "task_hint": "读取数据集 2分"
    },
    {
      "id": "blank_1_1_2_groupby_sensor",
      "raw_question_id": "raw_1_1_2",
      "item_type": "blank",
      "title": "按传感器类型分组",
      "prompt": "原题空位：sensor_stats = ____('SensorType')['Value'].agg(['count', 'mean'])。应填什么？",
      "starter_code": "sensor_stats = ____('SensorType')['Value'].agg(['count', 'mean'])",
      "answer_json": {
        "accepted_answers": [
          "data.groupby",
          "groupby"
        ]
      },
      "skills": [
        "pandas",
        "groupby"
      ],
      "knowledge_points": [
        "groupby",
        "SensorType",
        "Value"
      ],
      "mastery_level": 2,
      "estimated_seconds": 40,
      "xp": 10,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "按传感器类型分组应使用 data.groupby。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "groupby(\"SensorType\") 表示按传感器类型分组。"
      },
      "task_hint": "对传感器类型进行分组，并计算每个组的数据数量和平均值 3分"
    },
    {
      "id": "blank_1_1_2_agg_count_mean",
      "raw_question_id": "raw_1_1_2",
      "item_type": "blank",
      "title": "一次统计数量和均值",
      "prompt": "原题空位：data.groupby('SensorType')['Value'].____(['count', 'mean'])。应填什么？",
      "starter_code": "sensor_stats = data.groupby('SensorType')['Value'].____(['count', 'mean'])",
      "answer_json": {
        "accepted_answers": [
          "agg"
        ]
      },
      "skills": [
        "pandas",
        "groupby"
      ],
      "knowledge_points": [
        "agg",
        "count",
        "mean"
      ],
      "mastery_level": 2,
      "estimated_seconds": 40,
      "xp": 10,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "一次做多个聚合统计用 agg。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "agg([\"count\", \"mean\"]) 表示同时统计数量和均值。"
      },
      "task_hint": "对传感器类型进行分组，并计算每个组的数据数量和平均值 3分"
    },
    {
      "id": "blank_1_1_2_isin_temperature_humidity",
      "raw_question_id": "raw_1_1_2",
      "item_type": "blank",
      "title": "筛选温度和湿度传感器",
      "prompt": "原题空位：data['SensorType'].____(['Temperature', 'Humidity'])。应填什么？",
      "starter_code": "data['SensorType'].____(['Temperature', 'Humidity'])",
      "answer_json": {
        "accepted_answers": [
          "isin"
        ]
      },
      "skills": [
        "pandas",
        "filtering"
      ],
      "knowledge_points": [
        "isin",
        "Temperature",
        "Humidity"
      ],
      "mastery_level": 2,
      "estimated_seconds": 40,
      "xp": 10,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "筛选多个类别用 isin。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "isin([...]) 表示是否属于列表中的任意一个值。"
      },
      "task_hint": "筛选出温度和湿度数据，然后按位置和传感器类型分组，计算每个组的平均值 2分"
    },
    {
      "id": "blank_1_1_2_abnormal_np_where",
      "raw_question_id": "raw_1_1_2",
      "item_type": "blank",
      "title": "标记异常值函数",
      "prompt": "原题空位：data['is_abnormal'] = ____(条件, True, False)。应填什么？",
      "starter_code": "data['is_abnormal'] = ____(((...温度异常条件...) | (...湿度异常条件...)), True, False)",
      "answer_json": {
        "accepted_answers": [
          "np.where",
          "where"
        ]
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "np.where",
        "is_abnormal"
      ],
      "mastery_level": 2,
      "estimated_seconds": 45,
      "xp": 10,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "根据条件生成异常值标记列用 np.where。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "np.where(条件, True, False) 可生成布尔标记列。"
      },
      "task_hint": "标记异常值 3分：温度 < -10 或 > 50，湿度 < 0 或 > 100"
    },
    {
      "id": "blank_1_1_2_abnormal_sum",
      "raw_question_id": "raw_1_1_2",
      "item_type": "blank",
      "title": "统计异常值数量",
      "prompt": "原题空位：print(\"异常值数量:\", data['is_abnormal'].____)。应填什么？",
      "starter_code": "print('异常值数量:', data['is_abnormal'].____)",
      "answer_json": {
        "accepted_answers": [
          "sum()",
          "sum"
        ]
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "sum",
        "is_abnormal"
      ],
      "mastery_level": 2,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "布尔列求和可以统计 True 的数量。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "True 当作 1，False 当作 0，所以异常值数量用 sum()。"
      },
      "task_hint": "输出异常值数量 2分"
    },
    {
      "id": "blank_1_1_2_fillna_ffill",
      "raw_question_id": "raw_1_1_2",
      "item_type": "blank",
      "title": "前向填充缺失值",
      "prompt": "原题空位：data['Value'].____(method='ffill', inplace=True)。函数名填什么？",
      "starter_code": "data['Value'].____(method='ffill', inplace=True)",
      "answer_json": {
        "accepted_answers": [
          "fillna"
        ]
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "fillna",
        "ffill"
      ],
      "mastery_level": 2,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "原始考试代码使用 fillna 配合 method 参数。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "method=\"ffill\" 表示用前一个值填充。"
      },
      "task_hint": "使用前向填充和后向填充的方法填补缺失值 4分"
    },
    {
      "id": "blank_1_1_2_drop_abnormal_column",
      "raw_question_id": "raw_1_1_2",
      "item_type": "blank",
      "title": "删除异常标记列",
      "prompt": "原题空位：cleaned_data = ____(columns=['is_abnormal'])。应填什么？",
      "starter_code": "cleaned_data = ____(columns=['is_abnormal'])",
      "answer_json": {
        "accepted_answers": [
          "data.drop",
          "drop"
        ]
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "drop",
        "columns"
      ],
      "mastery_level": 2,
      "estimated_seconds": 40,
      "xp": 10,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "删除列用 data.drop(columns=[...])。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "columns 参数明确表示删除的是列。"
      },
      "task_hint": "删除用于标记异常值的列 4分"
    },
    {
      "id": "blank_1_1_2_to_csv",
      "raw_question_id": "raw_1_1_2",
      "item_type": "blank",
      "title": "导出清洗后的传感器数据",
      "prompt": "原题空位：____('cleaned_sensor_data.csv', index=False)。应填什么？",
      "starter_code": "____('cleaned_sensor_data.csv', index=False)",
      "answer_json": {
        "accepted_answers": [
          "cleaned_data.to_csv",
          "to_csv"
        ]
      },
      "skills": [
        "pandas",
        "data_cleaning"
      ],
      "knowledge_points": [
        "to_csv",
        "cleaned_sensor_data.csv"
      ],
      "mastery_level": 2,
      "estimated_seconds": 40,
      "xp": 10,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "导出 CSV 用 DataFrame.to_csv。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "index=False 表示不额外导出行索引。"
      },
      "task_hint": "将清洗后的数据保存到新的 CSV 文件中 4分"
    },
    {
      "id": "blank_1_1_3_missing_values",
      "raw_question_id": "raw_1_1_3",
      "item_type": "blank",
      "title": "统计缺失值",
      "prompt": "原题空位：missing_values = data._________。应填什么？",
      "starter_code": "missing_values = data._________",
      "answer_json": {
        "accepted_answers": [
          "isnull().sum()",
          "isna().sum()"
        ]
      },
      "skills": [
        "pandas",
        "validation"
      ],
      "knowledge_points": [
        "isnull",
        "sum",
        "missing values"
      ],
      "mastery_level": 2,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "缺失值统计用 isnull().sum()。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "isnull 判断空值，sum 统计每列空值数量。"
      },
      "task_hint": "数据缺失值统计 2分"
    },
    {
      "id": "blank_1_1_3_duplicate_values",
      "raw_question_id": "raw_1_1_3",
      "item_type": "blank",
      "title": "统计重复值",
      "prompt": "原题空位：duplicate_values = data._________。应填什么？",
      "starter_code": "duplicate_values = data._________",
      "answer_json": {
        "accepted_answers": [
          "duplicated().sum()"
        ]
      },
      "skills": [
        "pandas",
        "validation"
      ],
      "knowledge_points": [
        "duplicated",
        "sum"
      ],
      "mastery_level": 2,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "重复行统计用 duplicated().sum()。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "duplicated 判断重复行，sum 统计重复数量。"
      },
      "task_hint": "数据重复值统计 2分"
    },
    {
      "id": "blank_1_1_3_age_between",
      "raw_question_id": "raw_1_1_3",
      "item_type": "blank",
      "title": "年龄合理性审核",
      "prompt": "原题空位：data['is_age_valid'] = data['Age'].____(18, 70)。应填什么？",
      "starter_code": "data['is_age_valid'] = data['Age'].____(18, 70)",
      "answer_json": {
        "accepted_answers": [
          "between"
        ]
      },
      "skills": [
        "pandas",
        "validation"
      ],
      "knowledge_points": [
        "between",
        "Age"
      ],
      "mastery_level": 2,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "范围合理性检查用 between。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "between(18, 70) 默认包含边界。"
      },
      "task_hint": "Age 数据的合理性审核 2分"
    },
    {
      "id": "blank_1_1_3_loan_amount_valid",
      "raw_question_id": "raw_1_1_3",
      "item_type": "blank",
      "title": "贷款金额合理性审核",
      "prompt": "原题空位：data['is_loan_amount_valid'] = _________ < (_________ * 5)。应填完整表达式。",
      "starter_code": "data['is_loan_amount_valid'] = _________ < (_________ * 5)",
      "answer_json": {
        "accepted_answers": [
          "data['LoanAmount'] < (data['Income'] * 5)",
          "data[\"LoanAmount\"] < (data[\"Income\"] * 5)"
        ]
      },
      "skills": [
        "pandas",
        "validation"
      ],
      "knowledge_points": [
        "LoanAmount",
        "Income"
      ],
      "mastery_level": 2,
      "estimated_seconds": 60,
      "xp": 12,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "贷款金额要和收入比较。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "贷款金额小于收入 5 倍才算合理。"
      },
      "task_hint": "LoanAmount 数据的合理性审核 2分：贷款金额应小于收入的 5 倍"
    },
    {
      "id": "blank_1_1_3_credit_between",
      "raw_question_id": "raw_1_1_3",
      "item_type": "blank",
      "title": "信用分合理性审核",
      "prompt": "原题空位：data['is_credit_score_valid'] = data['CreditScore'].____(300, 850)。应填什么？",
      "starter_code": "data['is_credit_score_valid'] = data['CreditScore'].____(300, 850)",
      "answer_json": {
        "accepted_answers": [
          "between"
        ]
      },
      "skills": [
        "pandas",
        "validation"
      ],
      "knowledge_points": [
        "between",
        "CreditScore"
      ],
      "mastery_level": 2,
      "estimated_seconds": 30,
      "xp": 8,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "信用分范围检查也用 between。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "CreditScore 在 300 到 850 之间算合理。"
      },
      "task_hint": "CreditScore 数据的合理性审核 2分"
    },
    {
      "id": "blank_1_1_3_to_csv",
      "raw_question_id": "raw_1_1_3",
      "item_type": "blank",
      "title": "导出清洗后的信用数据",
      "prompt": "原题空位：_________._________(_________, index=False)。填写完整导出语句。",
      "starter_code": "_________._________(_________, index=False)",
      "answer_json": {
        "accepted_answers": [
          "cleaned_data.to_csv('cleaned_credit_data.csv', index=False)",
          "cleaned_data.to_csv(\"cleaned_credit_data.csv\", index=False)"
        ]
      },
      "skills": [
        "pandas",
        "validation"
      ],
      "knowledge_points": [
        "to_csv",
        "cleaned_credit_data.csv"
      ],
      "mastery_level": 2,
      "estimated_seconds": 60,
      "xp": 12,
      "feedback": {
        "run": "这道题对应 notebook 里的代码填空，重点是填入后能组成可运行代码。",
        "tests": "清洗后导出 CSV 用 cleaned_data.to_csv。",
        "better": "考试时先看题目要求，再定位对应的 Pandas / NumPy 函数。",
        "summary": "to_csv(\"文件名\", index=False) 是常见交付写法。"
      },
      "task_hint": "保存清洗后的数据：导出 cleaned_credit_data.csv"
    }
  ]
};
