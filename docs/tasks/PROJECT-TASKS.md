## Leave Management

### APIs

- [ ] Raise leave request api
  - **Conditions**
    - if user in probation, other than CL leave cant be requested
    - Check the balance of the leave type for the employee
    - need to check the leaveTypeMaster for wether the leave type is eligible for halfDay
- [ ] Get the leave request of the user api
  - **Conditions**
    - based on the users selected role
- [ ] Get the leave requests of the subordinates api
- [ ] Leave request approve / reject api
  - **Approve**
    - [ ] Reduce the requested leave days in leave balance in respective
    - [ ] Send the notification to the requested staff
    - [ ]
- [ ] Leave request cancel api

### Cron Jobs

- [ ] Yearly cron job to carry forward the leaves
- [ ] Daily cron to add the **Earned Leave** fora employee based on the working days
- [ ]
