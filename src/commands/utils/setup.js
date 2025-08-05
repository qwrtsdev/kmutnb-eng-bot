const {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ContainerBuilder,
    PermissionFlagsBits,
    InteractionContextType,
    MessageFlags,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("เมนูตั้งค่าห้อง (เฉพาะแอดมิน)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const promptComponents = [
            new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "### 🔨 **เมนูตั้งค่าห้องเฉพาะแอดมิน**\nกรุณาเลือกข้อความที่ต้องการตั้งค่า"
                    )
                )
                .addActionRowComponents(
                    new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("setup_selection")
                            .setPlaceholder("เลือกหน้าต่าง")
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("หน้าต่างการเปิดทิคเก็ตสนับสนุน")
                                    .setValue("setup_support_ticket")
                            )
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("หน้าต่างการยืนยันตัวตน")
                                    .setValue("setup_verification")
                            )
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel("หน้าต่างเลือกภาควิชา")
                                    .setValue("setup_department_roles")
                            )
                    )
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        "-# โปรดดำเนินการภายใน 10 วินาทีก่อนหมดอายุ"
                    )
                ),
        ];

        const channel = interaction.client.channels.cache.get(
            interaction.channel.id
        );
        const response = await interaction.reply({
            components: promptComponents,
            flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
        });

        const collectorFilter = (i) => i.user.id === interaction.user.id;

        try {
            const selection = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 10_000,
            });

            const selectedValue = selection.values[0];

            switch (selectedValue) {
                //  setup support ticket
                case "setup_support_ticket": {
                    const ticketComponent = [
                        new ContainerBuilder()
                            .addMediaGalleryComponents(
                                new MediaGalleryBuilder().addItems(
                                    new MediaGalleryItemBuilder().setURL(
                                        "https://media.discordapp.net/attachments/1399430120443482213/1399671433155842149/eng_component-cover-ticket.png?ex=6889d91a&is=6888879a&hm=716a02250916ae58889408c86bd4240884ab91f8ac8d6e0e7b0c8bb3fa5e52d2&=&format=webp&quality=lossless&width=1440&height=315"
                                    )
                                )
                            )
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    "# **🎟️ Support Ticket — ติดต่อแอดมิน**\nพื้นที่ช่วยเหลือหากคุณต้องการติดต่อสอบถามปัญหาแอดมินแบบส่วนตัว\nกรุณาใช้พื้นที่ตรงนี้ในการสร้างทิกเก็ต เพื่อติดต่อกับแอดมินโดยตรงแทนการทักข้อความส่วนตัว\nกรุณากดปุ่ม `ติดต่อแอดมิน` เพื่อเริ่มต้นการใช้งาน\n\n- หลังจากเปิดระบบแล้ว กรุณาแจ้งข้อมูลที่ต้องการอย่างละเอียดครบถ้วน และแนบรูปภาพหรือวิดีโอ (หากมี) โดยทันที ไม่ต้องรอให้แอดมินตอบกลับ แล้วเราจะทำการตอบกลับช่วยเหลือคุณให้ไวที่สุดเท่าที่จะเป็นไปได้\n\n-# การเปิดห้องเพื่อปั่นป่วนโดยไม่มีความจำเป็น จะมีบทลงโทษ หากไม่ได้ตั้งใจกรุณารีบกดปิดห้องโดยทันที"
                                )
                            )
                            .addSeparatorComponents(
                                new SeparatorBuilder()
                                    .setSpacing(SeparatorSpacingSize.Large)
                                    .setDivider(true)
                            )
                            .addActionRowComponents(
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Primary)
                                        .setLabel("ติดต่อแอดมิน")
                                        .setCustomId("create_support_ticket")
                                )
                            ),
                    ];

                    await channel.send({
                        components: ticketComponent,
                        flags: MessageFlags.IsComponentsV2,
                    });
                    break;
                }

                // setup verification
                case "setup_verification": {
                    const verificationComponent = [
                        new ContainerBuilder()
                            .addMediaGalleryComponents(
                                new MediaGalleryBuilder().addItems(
                                    new MediaGalleryItemBuilder().setURL(
                                        "https://media.discordapp.net/attachments/1399430120443482213/1399671433470279740/eng_component-cover-verify.png?ex=6889d91a&is=6888879a&hm=df45cbbcf78103e1db3af13af578d2485568bef0fb53d9db55cbedbab55e3f54&=&format=webp&quality=lossless&width=1440&height=315"
                                    )
                                )
                            )
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    '# ✅ Verification — ยืนยันตัวตน\nยินดีต้อนรับคุณเข้าสู่เซิร์ฟเวอร์คอมมูนิตี้ของ[คณะวิศวกรรมศาสตร์](https://www.eng.kmutnb.ac.th/) จาก[มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ](https://www.kmutnb.ac.th/?lang=th)\n\nก่อนที่คุณจะสามารถเข้าถึงห้องต่างๆภายในเซิร์ฟเวอร์แห่งนี้ คุณจะต้องดำเนินการ "ยืนยันตัวตน" เสียก่อน เพื่อทำการรับบทบาทในเซิร์ฟเวอร์\nคุณสามารถทำการยืนยันตัวตนได้โดยการกดปุ่ม ``เริ่มยืนยันตัวตน`` ด้านล่าง\n\n- สำหรับสมาชิกที่เป็นนักศึกษาจากคณะวิศวกรรมศาสตร์จะต้องพิมพ์ข้อมูลเพื่อยืนยันตัวตนเล็กน้อย\n- คุณจะต้องยอมรับว่าข้อมูลที่ใส่มานั้นเป็นความจริง หากตรวจสอบแล้วพบว่ามีการลงทะเบียนด้วยข้อมูลที่ไม่จริง หรือมีเจตนาปั่นป่วน อาจมีการลงโทษในภายหลัง\n\n-# หากคุณมีปัญหาในการยืนยันตัวตน กรุณาติดต่อแอดมินที่ปุ่มด้านล่าง'
                                )
                            )
                            .addSeparatorComponents(
                                new SeparatorBuilder()
                                    .setSpacing(SeparatorSpacingSize.Large)
                                    .setDivider(true)
                            )
                            .addActionRowComponents(
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Primary)
                                        .setLabel("เริ่มยืนยันตัวตน")
                                        .setCustomId("open_verification"),
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Link)
                                        .setLabel("มีปัญหาติดต่อที่นี่")
                                        .setURL(
                                            "https://discordapp.com/users/824442267318222879/"
                                        )
                                )
                            ),
                    ];

                    await channel.send({
                        components: verificationComponent,
                        flags: MessageFlags.IsComponentsV2,
                    });
                    break;
                }

                // setup department roles
                case "setup_department_roles": {
                    try {
                        const departmentRolesComponent = [
                            new ContainerBuilder()
                                .addMediaGalleryComponents(
                                    new MediaGalleryBuilder().addItems(
                                        new MediaGalleryItemBuilder().setURL(
                                            "https://media.discordapp.net/attachments/1399430120443482213/1402361121075105925/eng_departments.png?ex=6893a211&is=68925091&hm=64dff6b64b54ce8b49e41198d127d64604f28ebbb0def76dcad330ee6a4636af&=&format=webp&quality=lossless&width=1440&height=315"
                                        )
                                    )
                                )
                                .addTextDisplayComponents(
                                    new TextDisplayBuilder().setContent(
                                        '# **⚙️ Department Selection — เลือกภาควิชา**\nในคณะวิศวกรรมศาสตร์ จะมีภาควิชาทั้งหมด 9 ภาคในขณะนี้\nคุณปรับแต่งสถานะของตัวเองให้เข้ากับคุณ เพื่อเปลี่ยนลักษณะของคุณ และปลดล็อความสามารถ\n\n- หลังจากกดรับสถานะภาควิชาแล้ว ระบบจะทำการเปิดห้องตามภาควิชาที่เลือก\n- ระบบจะทำการมอบบทบาทตามที่คุณเลือก และเปลี่ยนชื่อในเซิร์ฟเวอร์\n- หากคุณต้องการลบสถานะออก กรุณาเลือก "ถอนสถานะ"\n\n-# หากพบปัญหาในการใช้งาน กรุณาติดต่อแอดมิน'
                                    )
                                )
                                .addSeparatorComponents(
                                    new SeparatorBuilder()
                                        .setSpacing(SeparatorSpacingSize.Large)
                                        .setDivider(true)
                                )
                                .addActionRowComponents(
                                    new ActionRowBuilder().addComponents(
                                        new StringSelectMenuBuilder()
                                            .setCustomId(
                                                "department_roles_selection"
                                            )
                                            .setPlaceholder(
                                                "เลือกภาควิชาของคุณ"
                                            )
                                            .addOptions(
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("ถอนสถานะ")
                                                    .setValue(
                                                        "department_roles_remove"
                                                    )
                                                    .setDescription(
                                                        "ลบตำแหน่งภาควิชาของคุณ"
                                                    )
                                                    .setEmoji({
                                                        name: "🚫",
                                                    }),
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("MAE")
                                                    .setValue("department_mae")
                                                    .setDescription(
                                                        "Mechanical and Aerospace Engineering"
                                                    ),
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("ECE")
                                                    .setValue("department_ece")
                                                    .setDescription(
                                                        "Electrical and Computer Engineering"
                                                    ),
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("PE")
                                                    .setValue("department_pe")
                                                    .setDescription(
                                                        "Production and Robotics Engineering"
                                                    ),
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("CHE")
                                                    .setValue("department_che")
                                                    .setDescription(
                                                        "Chemical Engineering"
                                                    ),
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("MHLE")
                                                    .setValue("department_mlhe")
                                                    .setDescription(
                                                        "Materials Handling and Logistics Engineering"
                                                    ),
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("MPTE")
                                                    .setValue("department_mpte")
                                                    .setDescription(
                                                        "Materials and Production Technology Engineering"
                                                    ),
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("IEE")
                                                    .setValue("department_iee")
                                                    .setDescription(
                                                        "Instrumentation and Electronics Engineering"
                                                    ),
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("CE")
                                                    .setValue("department_ce")
                                                    .setDescription(
                                                        "Civil Engineering"
                                                    ),
                                                new StringSelectMenuOptionBuilder()
                                                    .setLabel("IE")
                                                    .setValue("department_ie")
                                                    .setDescription(
                                                        "Industrial Engineering"
                                                    )
                                            )
                                    )
                                ),
                        ];

                        await channel.send({
                            components: departmentRolesComponent,
                            flags: MessageFlags.IsComponentsV2,
                        });
                    } catch (error) {
                        console.error(
                            "[setup_department_roles] error :",
                            error
                        );
                    }

                    break;
                }

                // default
                default:
                    break;
            }

            const successComponents = [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        `### ✅ ดำเนินการ \`\`${selectedValue}\`\` สำเร็จแล้ว`
                    )
                ),
            ];

            await interaction.editReply({
                components: successComponents,
            });
            await selection.deferUpdate();
        } catch (error) {
            const timeoutComponents = [
                new ContainerBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        `### ⌛ **การดำเนินการนี้หมดเวลาแล้ว**\n-# กรุณาใช้คำสั่งใหม่อีกครั้งหากต้องการดำเนินการต่อ`
                    )
                ),
            ];

            await interaction.editReply({
                components: timeoutComponents,
            });
        }
    },
};
