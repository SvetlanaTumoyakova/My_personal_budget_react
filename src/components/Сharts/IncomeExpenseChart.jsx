import React, { useState, useEffect, useContext } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { AccountsContext } from '../../context/AccountsContext';
import api from '../../api/index';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const apiUrl = "/Transaction/ChartsTransactions";

const IncomeExpenseChart = () => {
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState(null); // Для Chart.js нужен особый формат данных
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { currentAccount } = useContext(AccountsContext);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api(
                `${apiUrl}?accountId=${currentAccount.id}`
            );

            if (!response.ok) {
                throw new Error('Ошибка загрузки транзакций');
            }

            const data = await response.json();

            setTransactions(data.data);

            if (data.warning) {
                alert(data.warning);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentAccount.id) {
            fetchTransactions();
        }
    }, [currentAccount.id]);

    // Агрегация транзакций по месяцам и подготовка данных для Chart.js
    useEffect(() => {
        const aggregated = aggregateTransactionsByMonth(transactions);
        prepareChartData(aggregated);
        localStorage.setItem('chartData', JSON.stringify(aggregated));
    }, [transactions]);

    // Восстановление данных из localStorage при отсутствии транзакций
    useEffect(() => {
        if (transactions.length === 0) {
            const savedData = localStorage.getItem('chartData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                prepareChartData(parsedData);
            }
        }
    }, [transactions]);

    // Функция агрегации транзакций по месяцам
    const aggregateTransactionsByMonth = (transactions) => {
        const monthMap = {};

        transactions.forEach(transaction => {
            // Определяем тип транзакции
            const transactionType = transaction.transactionType?.toLowerCase();
            let isIncome = false;
            let amount = transaction.amount;

            // Логика определения дохода/расхода
            if (transactionType === 'income' || transactionType === 'доход') {
                isIncome = true;
            }

            const dateString = transaction.date.replace('T', ' ').replace('Z', '');
            const date = new Date(dateString);
            const month = date.toLocaleString('ru-RU', { month: 'short' });
            const year = date.getFullYear();
            const key = `${year} ${month}`;
            if (!monthMap[key]) {
                monthMap[key] = { income: 0, expense: 0, date: new Date(year, date.getMonth()) };
            }

            if (isIncome) {
                monthMap[key].income += amount;
            } else {
                monthMap[key].expense += amount;
            }
        });

        // Преобразуем в массив для графика, сортируем по дате
        return Object.entries(monthMap)
            .map(([month, values]) => ({
                month,
                income: values.income,
                expense: values.expense,
                date: values.date,
            }))
            .sort((a, b) => {
                return a.date - b.date;
            })
    };

    // Подготовка данных для Chart.js
    const prepareChartData = (aggregatedData) => {
        // Убираем преобразование через new Date, используем готовое значение
        const labels = aggregatedData.map(item => item.month);

        const incomeData = aggregatedData.map(item => item.income);
        const expenseData = aggregatedData.map(item => item.expense);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Доходы',
                    data: incomeData,
                    borderColor: '#00ff0d',
                    backgroundColor: 'rgba(0, 255, 13, 0.1)',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Расходы',
                    data: expenseData,
                    borderColor: '#ff0000',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        });
    };

    if (loading) return <div>Загрузка данных...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    if (!chartData) return <div>Нет данных для отображения</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Сравнительный график доходов и расходов по месяцам</h2>

            <div style={{ height: 400, width: '100%' }}>
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) =>
                                        `${context.dataset.label}: ${context.raw.toLocaleString('ru-RU')} руб.`
                                }
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Месяцы'
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Сумма (руб.)'
                                },
                                ticks: {
                                    callback: (value) => `${value.toLocaleString('ru-RU')}`,
                                    // Фиксируем шаг сетки, чтобы избежать сжатия больших чисел
                                    stepSize: 500
                                },
                                // Указываем, что данные могут быть большими
                                beginAtZero: true
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default IncomeExpenseChart;
