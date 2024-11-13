let bondModel=require('../../../models/user/sponsorBond');
const sponsorMissionModel = require('../../../models/user/sponsorMission');
const transactionModel = require('../../../models/user/transaction');
const issuerModel=require('../../../models/user/issuer')
const cancellationmodel=require('../../../models/user/cancellation');
const buyermodel = require('../../../models/user/buyer');
const userModel=require('../../../models/user/User')
const issuserModel=require('../../../models/user/issuer')

module.exports.getDashboardData = async (req, res) => {
    try {
       
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

       
        let users = await userModel.countDocuments({});
        let issuers = await issuerModel.countDocuments({});
        let buyers = await buyermodel.countDocuments({});

        
        let bondGraph = await bondModel.aggregate([
          
            { $match: {} }, 
            
            
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    totalIssued: { $sum: "$bond_issuerance_amount" }, 
                    count: { $sum: 1 } 
                }
            },
            
           
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            
            
            {
                $project: {
                    _id: 0,
                    name: { $arrayElemAt: [monthNames, { $subtract: ["$_id.month", 1] }] }, // Convert month number to month name
                    value: "$totalIssued" 
                }
            }
        ]);

      
        let usersGraph = await userModel.aggregate([
           
            { 
                $match: {} 
            },
            
            
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    registrations: { $sum: 1 } 
                }
            },
            
          
            { 
                $sort: { "_id.year": 1, "_id.month": 1 } 
            },
        
           
            {
                $group: {
                    _id: "$_id.month",
                    bottom: { $min: "$registrations" }, 
                    middle: { $avg: "$registrations" }, 
                    top: { $max: "$registrations" } 
                }
            },
        
            
            {
                $project: {
                    _id: 0,
                    name: { $arrayElemAt: [monthNames, { $subtract: ["$_id", 1] }] },
                    bottom: "$bottom",
                    middle: { $round: ["$middle", 0] }, 
                    top: "$top"
                }
            },
        
           
            { 
                $sort: { "name": 1 } 
            }
        ]);
     
        let transactionGraph = await transactionModel.aggregate([
            { $match: {} },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    totalTransactions: { $sum: "$amount" }, 
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    name: { $arrayElemAt: [monthNames, { $subtract: ["$_id.month", 1] }] },
                    value: "$totalTransactions" 
                }
            }
        ]);

        let issuanceAmount = await bondModel.aggregate([
            { 
                $match: {} 
            },
            { 
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" }, 
                        month: { $month: "$createdAt" } 
                    },
                    totalIssuanceAmount: { $sum: "$bond_issuerance_amount" } 
                }
            },
            { 
                $sort: { "_id.year": 1, "_id.month": 1 } 
            },
            { 
                $project: {
                    _id: 0,
                    name: { 
                        $arrayElemAt: [
                            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 
                            { $subtract: ["$_id.month", 1] }
                        ]
                    }, 
                    value: "$totalIssuanceAmount" 
                }
            }
        ]);
        

      
        

        
        return res.status(200).json({
            users,
            issuers,
            buyers,
            bondGraph,
            usersGraph,
            transactionGraph,
            issuanceAmount
        });

    } catch (e) {
        console.log(e.message)
        return res.status(400).json({
            error: "Server error, please try again"
        });
    }
};
